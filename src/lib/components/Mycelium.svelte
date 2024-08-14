<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script context="module" lang="ts">
  // For some reason, Eslint does not pick up the types with `strict-type-checked` enabled.
  declare type SvgViewerStrict = SvgViewer & {
    setFocus: (boundingBox: Readonly<BoundingBox>, transition?: boolean) => Promise<void>;
  };
</script>

<script lang="ts">
  import type {
    IEventDispatchSelection,
    IEventMinimapNavigation,
    IEventNode,
    IEventNodes,
  } from '$lib/events';
  import SvgViewer from './SvgViewer.svelte';
  import Minimap from './Minimap.svelte';
  import Breadcrumbs from './Breadcrumbs.svelte';
  import {
    needsModify,
    type ISelectionOptions,
    type Network,
    type NodeId,
    visibleNodesAndModules,
  } from '$lib/network';
  import { Viewport } from '$lib/viewport';
  import type { ILayoutProvider } from '$lib/layout';
  import { createEventDispatcher, onMount, setContext, tick } from 'svelte';
  import { writable } from 'svelte/store';
  import { viewerKey, type IViewerContext, type SelectionStore } from './stores';
  import {
    registerTooltip,
    keepAliveTooltip,
    markRemovalTooltip,
    type TooltipStore,
    type ITooltipWithPositition,
  } from './stores/tooltip';
  import type { IRectOptions } from '$lib/ui';
  import { BoundingBox } from '$lib/geometry/boundingBox';

  export let network: Network;
  export let width: number;
  export let height: number;
  export let showBreadcrumbs: boolean;
  export let showResetView: boolean;
  export let watermark: boolean;
  export let minimap: boolean;
  export let autoResize: boolean;
  export let multiSelection: boolean;
  autoResize; // Fix unused variable warning.

  export let decorations: Map<NodeId, Partial<IRectOptions>> = new Map();

  // By default we start with all modules collapsed to reduce initial layout time.
  export let collapsed = new Set(network.modules());
  $: hasExpanded = collapsed.size < network.modules().length;
  export let layoutProvider: ILayoutProvider;

  type TimeoutId = number;

  // Set up stores. TODO: We should refactor this.
  export const selectionStore: SelectionStore = writable(new Map<NodeId, Set<NodeId>>());
  export const tooltipStore: TooltipStore = writable(new Map<NodeId, ITooltipWithPositition>());
  // We use Svelte's context to allow multiple instances of the same component all with different stores.
  setContext<IViewerContext>(viewerKey, {
    selections: selectionStore,
    tooltips: tooltipStore,
  });
  const tooltipsPending: Map<NodeId, TimeoutId> = new Map();

  const dispatch = createEventDispatcher<IEventDispatchSelection>();

  $: drawable = layoutProvider.compute(network, collapsed);

  function resizeViewport(width: number, height: number) {
    viewport.resize(width, height);
    viewport = viewport;
  }

  let viewport = new Viewport(width, height);
  $: resizeViewport(width, height);

  onMount(async () => {
    await resetFocus();
  });

  const minimapSizeFactor = 0.2;

  let currentNodes: Array<NodeId> = [];
  $: currentNode = currentNodes.at(currentNodes.length - 1);

  let viewer: SvgViewerStrict;

  function padBreadcrumbs(boundingBox: BoundingBox): BoundingBox {
    const { yMin, yMax } = boundingBox;
    const offset = 20;
    const breadcrumbOffset = showBreadcrumbs
      ? (25 / (viewport.screenHeight() || 1)) * (yMax - yMin)
      : 0;

    return boundingBox.padded({
      l: offset,
      r: offset,
      t: offset + breadcrumbOffset,
      b: offset,
    });
  }

  export async function setFocus(target: NodeId | Array<NodeId>, transition?: boolean) {
    target = Array.isArray(target) ? target : [target];
    let merged = BoundingBox.infinity();
    for (const nodeId of target) {
      const found = drawable.nodes.get(nodeId)?.boundingBox();
      if (found) {
        merged = merged.union(found);
      }
    }
    if (!merged.isEmpty()) {
      // TODO: This should probably be handled via props
      await viewer.setFocus(padBreadcrumbs(merged), transition);
    }
  }

  export async function resetFocus(transition?: boolean) {
    // TODO: This should probably be handled via props
    await viewer.setFocus(padBreadcrumbs(drawable.boundingBox), transition);
  }

  export async function setSelections(
    nodeIds: Array<NodeId>,
    options?: Partial<ISelectionOptions>,
  ) {
    if (!multiSelection && nodeIds.length > 1) {
      console.warn('Received multiple selections but `multiSelection` config was set to `false`.');
      nodeIds = [nodeIds[0]];
    }

    const opts: ISelectionOptions = {
      expand: true,
      collapseOthers: { threshold: 1000 },
      ...options,
    };

    const { expand, collapse } = needsModify(network, nodeIds, collapsed, opts);
    let dirty = false;

    if (opts.expand) {
      if (expand.size > 1 && opts.expand === 'single') {
        // Do nothing
      } else if (expand.size > 0) {
        expand.forEach((n) => collapsed.delete(n));
        dirty = true;
      }
    }

    if (collapse.size > 0 && opts.collapseOthers !== false) {
      if (
        opts.collapseOthers === true ||
        visibleNodesAndModules(network, collapsed) > opts.collapseOthers.threshold
      ) {
        collapse.forEach((n) => collapsed.add(n));
        dirty = true;
      }
    }

    if (dirty) {
      collapsed = collapsed;
      await tick();
      $selectionStore = new Map(nodeIds.map((n) => [n, new Set()]));
      await resetFocus(true);
    } else {
      $selectionStore = new Map(nodeIds.map((n) => [n, new Set()]));
    }
  }

  async function updateSelections(
    sel: Map<NodeId, Set<NodeId>>,
  ): Promise<Map<NodeId, Set<NodeId>>> {
    const old = $selectionStore;
    $selectionStore = sel;
    await tick();
    return old;
  }

  export async function clearSelections(): Promise<Map<NodeId, Set<NodeId>>> {
    return await updateSelections(new Map());
  }

  export async function collapseAll() {
    collapsed = new Set(network.modules());
    await resetFocus(true);
  }

  async function handleExpand(e: CustomEvent<IEventNode>) {
    handleNodeLeave(e);
    collapsed.delete(e.detail.nodeId);
    collapsed = collapsed;
    await tick();
    await resetFocus(true);
  }

  async function handleCollapse(e: CustomEvent<IEventNode>) {
    handleNodeLeave(e);
    collapsed.add(e.detail.nodeId);
    collapsed = collapsed;
    await tick();
    await resetFocus(true);
  }

  function handleNodeEnter(e: CustomEvent<IEventNode>) {
    // It sometimes happens that `nodeEnter` events are fired twice in a row
    // (for example when zooming), so we account for that.
    if (currentNodes[currentNodes.length - 1] !== e.detail.nodeId) {
      currentNodes.push(e.detail.nodeId);
      currentNodes = currentNodes;
    }

    const nodeId = e.detail.nodeId;
    const tooltip = drawable.nodes.get(nodeId)?.options.tooltip;
    if (tooltip) {
      const tmp = $tooltipStore.get(nodeId);
      if (tmp === undefined) {
        tooltipsPending.set(nodeId, registerTooltip(tooltipStore, nodeId, tooltip().build()));
      } else if (tmp.state !== 'active' && tmp.state !== 'pinned') {
        keepAliveTooltip(tooltipStore, nodeId);
      }
    }
  }

  function handleNodeLeave(e: CustomEvent<IEventNode>) {
    currentNodes.pop();
    currentNodes = currentNodes;

    const nodeId = e.detail.nodeId;
    clearTimeout(tooltipsPending.get(nodeId));
    markRemovalTooltip(tooltipStore, nodeId);
  }

  async function handleNodeClick(e: CustomEvent<IEventNode & { original: MouseEvent }>) {
    const found = drawable.nodes.get(e.detail.nodeId);
    if (found?.options.selectable) {
      if (multiSelection && e.detail.original.metaKey) {
        emitSelectionChange(
          await updateSelections(
            new Map([...$selectionStore.entries(), [e.detail.nodeId, new Set()]]),
          ),
        );
      } else {
        emitSelectionChange(await updateSelections(new Map([[e.detail.nodeId, new Set()]])));
      }
    }
  }

  function emitSelectionChange(previous: Map<NodeId, Set<NodeId>>) {
    const convert = ([primary, secondary]: [NodeId, Set<NodeId>]) => ({
      primaryNodeId: primary,
      secondaryIds: [...secondary.values()],
    });

    dispatch('selectionDidChange', {
      selections: [...$selectionStore.entries()].map(convert),
      previous: [...previous.entries()].map(convert),
    });
  }

  async function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      emitSelectionChange(await clearSelections());
    }
  }

  function handleMinimapNavigation(e: CustomEvent<IEventMinimapNavigation>) {
    const { x, y } = e.detail.center;
    viewport.moveTo(x, y);
    viewport = viewport;
  }

  async function handleBrush(e: CustomEvent<IEventNodes>) {
    emitSelectionChange(
      await updateSelections(new Map(e.detail.nodes.map((nodeId) => [nodeId, new Set()]))),
    );
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="myc-container">
  {#key network}
    <SvgViewer
      bind:this={viewer}
      bind:viewport
      {decorations}
      {drawable}
      {multiSelection}
      on:expand={handleExpand}
      on:collapse={handleCollapse}
      on:nodeEnter={handleNodeEnter}
      on:nodeLeave={handleNodeLeave}
      on:nodeClick={handleNodeClick}
      on:brush={handleBrush}
    />
  {/key}
  {#if showBreadcrumbs || showResetView}
    <div class="myc-navigation">
      {#if showBreadcrumbs}
        <Breadcrumbs {network} {currentNode} {drawable} />
      {/if}
      <div class="myc-navigation-controls">
        {#if hasExpanded}
          <div>
            <button class="resetView" on:click={() => collapseAll()}>Collapse All</button>
          </div>
        {/if}
        {#if showResetView}
          <div>
            <button
              class="resetView"
              on:click={async () => {
                await resetFocus(true);
              }}>Show All</button
            >
          </div>
        {/if}
      </div>
    </div>
  {/if}
  <div class="myc-overlay">
    {#if watermark}
      Powered by <a href="https://apple.github.io/ml-mycelium" target="_blank">Mycelium</a>
    {/if}
  </div>
  {#if minimap}
    <div class="myc-minimap">
      <Minimap
        on:viewportCenterDidChange={handleMinimapNavigation}
        width={width * minimapSizeFactor}
        height={height * minimapSizeFactor}
        worldExtent={viewport.world()}
        {drawable}
      />
    </div>
  {/if}
</div>

<style>
  :global(.myc-container) {
    --black: black;
    --gray-tertiary: rgb(134, 134, 139);
    --ios-blue: rgb(0, 122, 255);
  }

  .myc-container {
    flex: 1;
    position: relative;
  }

  .myc-navigation {
    display: flex;
    place-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 2em;
    border-bottom: 1px solid rgba(224, 224, 228, 0.5);
    background-color: rgba(240, 240, 245, 0.5);
    backdrop-filter: blur(10px);
    font-size: 13px;
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      sans-serif;
  }

  .myc-navigation .resetView {
    all: none;
    padding: 0 10px;
  }

  .myc-navigation button:hover {
    color: var(--ios-blue);
  }

  .myc-navigation button:visited {
    color: var(--ios-blue);
  }

  .myc-navigation-controls {
    display: flex;
  }

  .myc-overlay {
    font-size: 10px;
    font-family: 'SF Mono', ui-monospace, monospace;
    color: var(--gray-tertiary);
    position: absolute;
    bottom: 10px;
    right: 5px;
  }

  .myc-overlay a {
    color: var(--ios-blue);
  }

  .myc-minimap {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
</style>

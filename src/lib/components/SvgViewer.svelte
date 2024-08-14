<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { NodeDisplayObject } from '$lib/ui/node';
  import TooltipLayer from './TooltipLayer.svelte';
  import ExpandedModule from './ExpandedModule.svelte';
  import { Viewport } from '$lib/viewport';
  import { BoundingBox, type IPoint } from '$lib/geometry';
  import { ZoomBehavior } from '$lib/zoom';
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';
  import type { IEventDispatchBrush, IEventDispatchModule, IEventDispatchNode } from '$lib/events';
  import Brush from './Brush.svelte';
  import type { NodeId } from '$lib/network';
  import EdgeContainer from './graph/EdgeContainer.svelte';
  import SvelteNode from './Node.svelte';
  import type { IDrawableNetwork } from '$lib/layout';
  import type { IRectOptions } from '$lib/ui';

  export let decorations: Map<NodeId, Partial<IRectOptions>>;
  export let drawable: IDrawableNetwork;
  export let viewport: Viewport;
  export let multiSelection: boolean;
  $: viewportWorld = viewport.world();
  const zoom = new ZoomBehavior(viewport);

  type InitialState = { kind: 'initial' };
  type AwaitBrushingState = { kind: 'awaitBrushing' };
  type ZoomingState = { kind: 'panning'; start: IPoint; tmp: Viewport };
  type BrushingState = { kind: 'brushing'; start: IPoint; end: IPoint };
  type Interaction = InitialState | ZoomingState | BrushingState | AwaitBrushingState;

  $: zoom
    .setScaleExtent({
      min:
        Math.min(
          viewport.screenWidth() / drawable.boundingBox.width,
          viewport.screenHeight() / drawable.boundingBox.height,
        ) * 0.5,
      max: 1,
    })
    .setTranslationExtent(
      drawable.boundingBox.padded({
        l: viewportWorld.width * 0.4,
        r: viewportWorld.width * 0.4,
        t: viewportWorld.height * 0.4,
        b: viewportWorld.height * 0.4,
      }),
    );

  let svg: SVGSVGElement;

  $: transform = viewport.worldToScreen().toString();

  function screenPointFromEvent(event: TouchEvent | MouseEvent) {
    let point = svg.createSVGPoint();
    if ('targetTouches' in event) {
      point.x = event.targetTouches[0].clientX;
      point.y = event.targetTouches[0].clientY;
    } else {
      point.x = event.clientX;
      point.y = event.clientY;
    }
    point = point.matrixTransform(svg.getScreenCTM()?.inverse());
    return point;
  }

  function deriveCursor(state: Interaction): string {
    switch (state.kind) {
      case 'initial':
        return 'grab';
      case 'panning':
        return 'grabbing';
      case 'brushing':
      case 'awaitBrushing':
        return 'default';
    }
  }

  let state: Interaction = { kind: 'initial' };
  $: cursor = deriveCursor(state);

  function handleMouseDown(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    if (!('targetTouches' in event) && event.button !== 0) {
      return;
    }

    const { x, y } = screenPointFromEvent(event);
    const start = viewport.screenToWorld().apply(x, y);

    if (event.shiftKey && multiSelection) {
      state = {
        kind: 'brushing',
        start,
        end: start,
      };
    } else {
      // Adapted from https://stackoverflow.com/a/52640900 (CC BY-SA 4.0)
      state = {
        kind: 'panning',
        start,
        tmp: new Viewport(
          viewport.screenWidth(),
          viewport.screenHeight(),
          viewport.center(),
          viewport.scale(),
        ),
      };
      zoom.setViewport(state.tmp);
    }
  }

  function handleMouseUp() {
    switch (state.kind) {
      case 'initial':
        return;

      case 'panning': {
        viewport.scaleTo(state.tmp.scale());
        const { x, y } = state.tmp.center();
        viewport.moveTo(x, y);
        zoom.setViewport(viewport);
        state = { kind: 'initial' };
        break;
      }

      case 'brushing': {
        const bb = BoundingBox.fromPoints(state.start, state.end);
        const contained = [...drawable.nodes.entries()]
          .filter(([_, node]: [NodeId, NodeDisplayObject]) => bb.encloses(node.boundingBox()))
          .map(([nodeId, _]) => nodeId);
        dispatch('brush', { nodes: contained });
        break;
      }
    }
    state = { kind: 'initial' };
  }

  function handleMouseMove(event: TouchEvent | MouseEvent) {
    const { x, y } = screenPointFromEvent(event);
    const pointerPositionWorld = viewport.screenToWorld().apply(x, y);
    switch (state.kind) {
      case 'initial':
        return;

      case 'panning': {
        const deltaX = state.start.x - pointerPositionWorld.x;
        const deltaY = state.start.y - pointerPositionWorld.y;
        zoom.moveBy(deltaX, deltaY);
        viewport = viewport;
        break;
      }

      case 'brushing': {
        state.end = pointerPositionWorld;
        break;
      }
    }
  }

  function handleZoomWheel(event: WheelEvent) {
    event.preventDefault();
    // The following constants are taken from d3-zoom:
    // https://github.com/d3/d3-zoom/blob/95cd670cf2322b455eb6b04e95a5fb1fc963f269/src/zoom.js#L35
    const k = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002);
    const before = viewport.scale();
    zoom.scaleBy(Math.pow(2, k));
    if (before === viewport.scale()) {
      return;
    }

    const center = viewport.center();
    const { x, y } = screenPointFromEvent(event);
    const worldPoint = viewport.screenToWorld().apply(x, y);
    zoom.moveBy(-(center.x - worldPoint.x) * k, -(center.y - worldPoint.y) * k);
    viewport = viewport;
  }

  export async function setFocus(boundingBox: Readonly<BoundingBox>, transition?: boolean) {
    const bb = BoundingBox.fromCenterAndDimension(
      boundingBox.center,
      Math.max(viewport.screenWidth(), boundingBox.width),
      Math.max(viewport.screenHeight(), boundingBox.height),
    );

    const { x, y } = bb.center;
    const k =
      Math.min(
        viewport.screenWidth() / boundingBox.width,
        viewport.screenHeight() / boundingBox.height,
      ) || 1; // Scale of 0 is invalid

    if (transition !== undefined && transition) {
      const progress = tweened(
        { ...viewport.center(), k: viewport.scale() },
        { duration: 1000, easing: cubicInOut },
      );
      progress.subscribe((c) => {
        zoom.moveTo(c.x, c.y);
        zoom.scaleTo(c.k);
        viewport = viewport;
      });
      await progress.set({ x, y, k });
    } else {
      zoom.moveTo(x, y);
      zoom.scaleTo(k);
      viewport = viewport;
    }
  }

  const dispatch = createEventDispatcher<
    IEventDispatchNode & IEventDispatchModule & IEventDispatchBrush
  >();

  function handleCollapse(e: MouseEvent, nodeId: NodeId) {
    e.stopPropagation();
    dispatch('collapse', { nodeId });
  }

  function handleExpand(e: MouseEvent, nodeId: NodeId) {
    e.stopPropagation();
    dispatch('expand', { nodeId });
  }

  function handleNodeClick(e: MouseEvent, nodeId: NodeId) {
    e.stopPropagation();
    dispatch('nodeClick', { nodeId, original: e });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (state.kind === 'initial' && e.shiftKey && multiSelection) {
      state = { kind: 'awaitBrushing' };
    }
  }

  function handleKeyUp() {
    if (state.kind === 'awaitBrushing') {
      state = { kind: 'initial' };
    }
  }
</script>

<svelte:window
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
/>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<svg
  role="figure"
  bind:this={svg}
  width={viewport.screenWidth()}
  height={viewport.screenHeight()}
  on:mousedown={handleMouseDown}
  on:wheel={handleZoomWheel}
  style={`cursor: ${cursor}`}
>
  <g transform={transform.toString()}>
    {#each [...drawable.expanded.entries()] as [nodeId, { name, boundingBox }] (nodeId)}
      <ExpandedModule
        {nodeId}
        {name}
        {boundingBox}
        on:dblclick={(e) => {
          handleCollapse(e, nodeId);
        }}
        on:nodeEnter
        on:nodeLeave
      />
    {/each}
    <EdgeContainer self={drawable.edges} />
    {#each [...drawable.nodes.entries()] as [nodeId, entity] (nodeId)}
      <SvelteNode
        self={entity}
        decoration={decorations.get(nodeId)}
        on:click={(e) => {
          handleNodeClick(e, nodeId);
        }}
        on:nodeEnter
        on:nodeLeave
      />
    {/each}
    {#each [...drawable.collapsed.entries()] as [nodeId, entity] (nodeId)}
      <SvelteNode
        self={entity}
        decoration={decorations.get(nodeId)}
        on:dblclick={(e) => {
          handleExpand(e, nodeId);
        }}
        on:nodeEnter
        on:nodeLeave
      />
    {/each}
    {#if state.kind === 'brushing'}
      <Brush start={state.start} end={state.end} />
    {/if}
    <TooltipLayer nodeLayouts={drawable.nodes} on:nodeEnter on:nodeLeave />
  </g>
</svg>

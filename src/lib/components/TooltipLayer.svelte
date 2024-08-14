<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { getContext } from 'svelte';
  import { viewerKey, type IViewerContext } from './stores';
  import Tooltip from './Tooltip.svelte';
  import type { NodeId } from '$lib/network';
  import {
    keepAliveTooltip,
    markRemovalTooltip,
    togglePinTooltip,
    type TooltipState,
  } from './stores/tooltip';
  import type { IPoint } from '$lib/geometry';
  import {} from '$lib/ui';
  import type { BoundingBox } from '$lib/geometry/boundingBox';
  import type { DisplayObject } from '$lib/scene';
  import { positionTooltip, type TooltipDisplayObject } from '$lib/ui/tooltip';

  const { tooltips } = getContext<IViewerContext>(viewerKey);

  const tooltipOffset = 20;

  export let nodeLayouts: Map<NodeId, DisplayObject>;

  function handleMouseEnter(e: CustomEvent<{ nodeId: NodeId }>) {
    keepAliveTooltip(tooltips, e.detail.nodeId);
  }

  function handleMouseLeave(e: CustomEvent<{ nodeId: NodeId }>) {
    markRemovalTooltip(tooltips, e.detail.nodeId);
  }

  function togglePin(e: CustomEvent<{ nodeId: NodeId }>) {
    togglePinTooltip(tooltips, e.detail.nodeId);
  }

  $: visibleTooltips = [...$tooltips.entries()]
    .filter(([nodeId]) => nodeLayouts.has(nodeId))
    .map(([id, { tooltip, state }]) => {
      const bb = nodeLayouts.get(id)?.boundingBox() as BoundingBox;
      const position = positionTooltip(
        bb,
        tooltip.boundingBox(),
        tooltip.options.anchor,
        tooltipOffset,
      );
      return [id, { position, tooltip, state }] as [
        NodeId,
        { position: IPoint; tooltip: TooltipDisplayObject; state: TooltipState },
      ];
    });
</script>

{#each visibleTooltips as [id, { position, tooltip, state }] (id)}
  <g transform={`translate(${position.x},${position.y})`}>
    <Tooltip
      nodeId={id}
      {tooltip}
      {state}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
      on:togglePin={togglePin}
      on:nodeEnter
      on:nodeLeave
    />
  </g>
{/each}

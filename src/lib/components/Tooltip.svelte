<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { NodeId } from '$lib/network';
  import { createEventDispatcher } from 'svelte';
  import type { TooltipState } from './stores/tooltip';
  import { Theme } from '$lib/ui';
  import type { IEventDispatchNode } from '$lib/events';
  import Pin from './icons/Pin.svelte';
  import type { TooltipDisplayObject } from '$lib/ui/tooltip';

  export let nodeId: NodeId;
  export let tooltip: TooltipDisplayObject;
  export let state: TooltipState;

  const dispatch = createEventDispatcher<
    {
      togglePin: { nodeId: NodeId };
      mouseenter: { nodeId: NodeId };
      mouseleave: { nodeId: NodeId };
    } & IEventDispatchNode
  >();

  function pin(e: Event) {
    e.stopPropagation();
    dispatch('togglePin', { nodeId });
  }

  function handleMouseEnter(e: MouseEvent) {
    dispatch('nodeEnter', { ...e, nodeId });
  }

  function handleMouseLeave(e: MouseEvent) {
    dispatch('nodeLeave', { ...e, nodeId });
  }

  $: boundingBox = tooltip.boundingBox();
  const badgeOffset = { x: 1, y: 1 };
</script>

<g role="tooltip" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
  <svelte:component this={tooltip.content.drawable()} {...{ self: tooltip.content }} />
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <g
    transform={`translate(${boundingBox.width + badgeOffset.x},${-badgeOffset.y})`}
    on:click={pin}
    on:keydown={pin}
    cursor="pointer"
  >
    <rect
      x="-37"
      y="-10"
      width="50"
      height="20"
      rx="10"
      fill={state === 'pinned' ? 'orange' : 'rgb(51,51,51)'}
      stroke="white"
      stroke-width="2"
    />
    <text
      x="-18"
      y={1}
      font-family={Theme.font.family}
      font-size="10"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="white">Pin</text
    >
    <g transform="scale(0.2) translate(-32 -30)">
      <Pin />
    </g>
  </g>
</g>

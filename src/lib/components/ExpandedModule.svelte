<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { IEventDispatchNode } from '$lib/events';
  import type { BoundingBox } from '$lib/geometry/boundingBox';
  import type { NodeId } from '$lib/network';
  import { createEventDispatcher } from 'svelte';
  import { Theme } from '$lib/ui';

  const dispatch = createEventDispatcher<IEventDispatchNode>();

  export let nodeId: NodeId;
  export let name: string;
  export let boundingBox: BoundingBox;

  function handleMouseEnter() {
    dispatch('nodeEnter', { nodeId });
  }

  function handleMouseLeave() {
    dispatch('nodeLeave', { nodeId });
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g
  class="expand"
  transform={`translate(${boundingBox.xMin},${boundingBox.yMin})`}
  on:click
  on:dblclick
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <rect
    width={boundingBox.width}
    height={boundingBox.height}
    fill="rgb(250,250,250)"
    stroke="rgb(134, 134, 139)"
    stroke-width="1"
    rx="6"
  />
  <text y="-2" font-family={Theme.font.family}>{name}</text>
</g>

<style>
  .expand rect {
    cursor: pointer;
  }

  .expand text {
    cursor: pointer;
  }

  .expand:hover rect {
    stroke: var(--ios-blue);
  }

  .expand:hover text {
    fill: var(--ios-blue);
  }
</style>

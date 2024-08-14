<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import { viewerKey, type IViewerContext } from './stores';
  import type { IEventDispatchNode } from '$lib/events';
  import { Theme, Rect, type IRectOptions } from '$lib/ui';
  import type { NodeDisplayObject } from '$lib/ui/node';
  import SvelteRect from '$lib/components/elements/Rect.svelte';

  const dispatch = createEventDispatcher<IEventDispatchNode>();

  export let self: NodeDisplayObject;
  export let decoration: Partial<IRectOptions> | undefined;

  $: nodeId = self.nodeId;

  const { selections } = getContext<IViewerContext>(viewerKey);
  $: selected = $selections.has(nodeId);

  $: boundingBox = self.boundingBox();
  $: badge = self.options.badge;

  const badgeOffset = { x: 1, y: 1 };

  let isHover = false;

  function handleMouseEnter(e: MouseEvent) {
    isHover = true;
    dispatch('nodeEnter', { ...e, nodeId });
  }

  function handleMouseLeave(e: MouseEvent) {
    isHover = false;
    dispatch('nodeLeave', { ...e, nodeId });
  }

  $: frame = new Rect(self.content.boundingBox().width, self.content.boundingBox().height)
    .with({
      borderColor: Theme.colors.foreground.grayTertiary,
      borderWidth: 1,
      radius: 6,
      borderDash: self.options.borderDash,
      backgroundColor: self.options.backgroundColor,
    })
    .with({ ...decoration })
    .with(isHover ? { borderColor: Theme.colors.foreground.blue } : {})
    .with(selected ? { borderColor: Theme.colors.foreground.blue, borderWidth: 3 } : {})
    .build();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g
  transform={`translate(${boundingBox.xMin},${boundingBox.yMin})`}
  cursor="pointer"
  on:click
  on:dblclick
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <SvelteRect self={frame} />
  <svelte:component this={self.content.drawable()} {...{ self: self.content }} /> -->
  {#if badge}
    <g
      class="badge"
      transform={`translate(${boundingBox.width + badgeOffset.x},${-badgeOffset.y})`}
    >
      <circle r="10" fill={badge.color} stroke="white" stroke-width="2" />
      {#if badge.text}
        <text
          y={1}
          font-family={Theme.font.family}
          font-size="10"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="white">{badge.text}</text
        >
      {/if}
    </g>
  {/if}
</g>

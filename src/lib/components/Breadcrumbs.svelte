<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { IDrawableNetwork } from '$lib/layout';
  import type { Network, NodeId } from '$lib/network';

  export let defaultText = 'Hover over any node to show more information.';
  export let network: Network;
  export let drawable: IDrawableNetwork;
  export let currentNode: NodeId | undefined;

  $: breadcrumbs = currentNode
    ? [currentNode, ...network.parents(currentNode)]
        .reverse()
        .map((nodeId) => network.node(nodeId).humanReadable() || nodeId)
    : [];
</script>

<div>
  {#if currentNode}
    {#each breadcrumbs as level, i}
      <span>{level}</span>
      {#if i < breadcrumbs.length - 1}
        <span>⟩</span>
      {/if}
    {/each}
    {#if drawable.collapsed.has(currentNode)}
      <span>(Double click to expand)</span>
    {:else if drawable.expanded.has(currentNode)}
      <span>(Double click to collapse)</span>
    {/if}
  {:else}
    <span>{defaultText}</span>
  {/if}
</div>

<style>
  span {
    padding: 0 10px;
  }
</style>

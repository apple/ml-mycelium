<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { NetworkViewer, Network, type IEventSelectionChanged } from '$lib';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let network: Network;
  export let title: string;

  let app: HTMLElement;
  let viewer: NetworkViewer;

  async function handleClick(e: IEventSelectionChanged) {
    console.info('Selection Changed Event', e);
    if (e.selections.length > 0) {
      const ids = e.selections.map((s) => s.primaryNodeId);
      console.info(`New selected nodes: ${ids.join(',')}.`);
      await viewer.setFocus(ids, true);
    }
  }

  onMount(() => {
    viewer = NetworkViewer.create(network, app, { showBreadcrumbs: true, watermark: false });
    viewer.onSelectionDidChange((e) => {
      // We ignore the result of the promise here.
      const _ = handleClick(e);
    });
    dispatch('created', { viewer });
  });
</script>

<svelte:head>
  <title>{title} • Mycelium</title>
</svelte:head>

<div class="w-full h-full" id="app" bind:this={app} />

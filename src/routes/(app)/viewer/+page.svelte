<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { viewerData } from '../../stores';
  import type { Network } from '$lib';
  import Viewer from '../_components/Viewer.svelte';
  import { createDotNetworkModel } from '$lib/loader/dot';
  import { createNetworkModel } from '$lib/loader/onnx';

  let network = undefined as Network | undefined;

  viewerData.subscribe((data) => {
    switch (data?.kind) {
      case undefined:
        break;
      case 'dot':
        network = createDotNetworkModel(data.data);
        break;
      case 'onnx':
        network = createNetworkModel(data.data);
        break;
    }
  });
</script>

<svelte:head>
  <title>Viewer • Mycelium</title>
</svelte:head>

{#if network}
  {#key network}
    <Viewer title="Viewer" {network} />
  {/key}
{:else}
  <div class="grid w-full h-full place-items-center bg-gray-quaternary">
    <div class="flex flex-col items-center">
      <svg width="200" height="200">
        <rect
          x="10"
          y="10"
          width="180"
          height="180"
          rx="12"
          fill="none"
          stroke="black"
          stroke-opacity="0.2"
          stroke-width="5"
          stroke-dasharray="12"
        />
      </svg>
      <div class="opacity-40">Drop file here...</div>
    </div>
  </div>
{/if}

<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  export let name: string;
  export let icon: string;
</script>

<div class="flex flex-col items-center gap-2">
  {#if icon.length > 2}
    <img class="inline-block h-12 w-12 rounded-full" src={icon} alt={`Picture of ${name}`} />
  {:else}
    <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
      <span class="text-xl font-medium leading-none text-white">{icon}</span>
    </span>
  {/if}
  <div class="text-gray-900">{name}</div>
</div>

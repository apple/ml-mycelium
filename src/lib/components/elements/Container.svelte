<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { Container } from '$lib/scene';

  export let self: Container;
</script>

<g transform={self.transform.toString()}>
  <slot />
  {#each self.children as c}
    {#if import.meta.env.VITE_WIREFRAME_CONTAINER}
      <rect
        x={c.boundingBox().transformed(c.transform).xMin}
        y={c.boundingBox().transformed(c.transform).yMin}
        width={c.boundingBox().transformed(c.transform).width}
        height={c.boundingBox().transformed(c.transform).height}
        fill="magenta"
        opacity="0.1"
      />
    {/if}
    <svelte:component this={c.drawable()} {...{ self: c }} />
  {/each}
</g>

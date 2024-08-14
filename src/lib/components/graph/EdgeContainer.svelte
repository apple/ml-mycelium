<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { EdgesDisplayObject } from '$lib/ui/edge';
  import SvelteContainer from '../elements/Container.svelte';

  export let self: EdgesDisplayObject;
</script>

<SvelteContainer {self}>
  <slot>
    <defs>
      <marker
        id="arrowhead"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerUnits="strokeWidth"
        markerWidth="10"
        markerHeight="12"
        orient="auto"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 L 4 5 z"
          fill="var(--gray-tertiary)"
          style="stroke-width: 1;"
        />
      </marker>
    </defs>
  </slot>
</SvelteContainer>

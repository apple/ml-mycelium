<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  export let title: string;
  export let tagline: string | undefined = undefined;
</script>

<div class="mt-16 sm:mt-24 mx-auto max-w-2xl lg:text-center">
  {#if tagline}<h2 class="text-base font-semibold leading-7 text-blue-600">{tagline}</h2>{/if}
  <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
    {title}
  </p>
  {#if $$slots.subtitle}
    <p class="mt-6 text-lg leading-8 text-gray-600">
      <slot name="subtitle" />
    </p>
  {/if}
</div>
<div class="mx-auto max-w-2xl lg:max-w-4xl">
  <slot />
</div>

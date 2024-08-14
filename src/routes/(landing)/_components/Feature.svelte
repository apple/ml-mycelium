<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { Icon, type IconSource } from '@steeze-ui/svelte-icon';

  export let title: string;
  export let icon: IconSource;
</script>

<div class="relative pl-16">
  <dt class="text-base font-semibold leading-7 text-gray-900">
    <div
      class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600"
    >
      <Icon src={icon} theme="solid" class="text-white h-6 w-auto" />
    </div>
    {title}
  </dt>
  <dd class="mt-2 text-base leading-7 text-gray-600">
    <slot />
  </dd>
</div>

<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  export let org: string;
  export let model: string;
</script>

<div class="flex gap-1">
  <span class="text-gray-500">{org}</span><span  class="text-gray-300">/</span><span>{model}</span>
</div>

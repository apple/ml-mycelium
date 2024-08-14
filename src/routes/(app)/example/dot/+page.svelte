<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { Network } from '$lib';
  import Viewer from '../../_components/Viewer.svelte';
  export let data: { network: Network };
</script>

<Viewer title="Graphviz Dot • Example" network={data.network} />

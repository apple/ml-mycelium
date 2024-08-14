<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
   import Viewer from '../../_components/Viewer.svelte';
   import type { PageData } from './$types';
   export let data: PageData;
 </script>

 <Viewer title="LeNet • Example" network={data.network} />

<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { BoundingBox, type IPoint } from '$lib/geometry';

  export let start: IPoint;
  export let end: IPoint;

  $: bb = BoundingBox.fromPoints(start, end);
</script>

<rect x={bb.xMin} y={bb.yMin} width={bb.width} height={bb.height} fill="grey" opacity="0.2" />

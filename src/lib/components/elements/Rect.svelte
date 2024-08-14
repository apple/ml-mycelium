<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { RectDisplayObject } from '$lib/ui/rect';

  export let self: RectDisplayObject;

  const width = self.boundingBox().width;
  const height = self.boundingBox().height;
  $: ({ borderColor, backgroundColor, borderWidth, borderDash, radius } = self.options);
</script>

<rect
  x={self.transform.x}
  y={self.transform.y}
  {width}
  {height}
  rx={radius}
  fill={backgroundColor}
  stroke={borderColor}
  stroke-width={borderWidth}
  stroke-dasharray={borderDash}
/>

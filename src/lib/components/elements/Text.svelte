<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { TextDisplayObject } from '$lib/ui/text';
  export let self: TextDisplayObject;
  const { fontSize, font, foregroundColor, fontWeight } = self.options;
</script>

{#if import.meta.env.VITE_WIREFRAME_TEXT}
  <rect
    x={self.boundingBox().transformed(self.transform).xMin}
    y={self.boundingBox().transformed(self.transform).yMin}
    width={self.boundingBox().transformed(self.transform).width}
    height={self.boundingBox().transformed(self.transform).height}
    fill="magenta"
    opacity="0.3"
  />
{/if}
<text
  x={self.transform.x}
  y={self.transform.y}
  dominant-baseline="hanging"
  font-family={font}
  font-size={fontSize}
  fill={foregroundColor}
  font-weight={fontWeight}>{self.text}</text
>

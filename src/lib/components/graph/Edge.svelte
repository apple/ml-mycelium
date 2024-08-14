<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { CurveBuilder } from '$lib/geometry/curveBuilder';
  import { Theme } from '$lib/ui';
  import type { EdgeDisplayObject } from '$lib/ui/edge';

  export let self: EdgeDisplayObject;
  $: points = self.points.map((p) => self.transform.apply(p.x, p.y));
</script>

<path
  stroke={Theme.colors.foreground.grayTertiary}
  stroke-width="1"
  fill="none"
  pointer-events="none"
  marker-end="url(#arrowhead)"
  d={new CurveBuilder(points).build()}
/>

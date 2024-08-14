<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import type { IDrawableNetwork } from '$lib/layout';
  import type { IEventDispatchMinimap } from '$lib/events';
  import type { BoundingBox } from '$lib/geometry/boundingBox';
  import { Viewport } from '$lib/viewport';
  import { createEventDispatcher, onMount } from 'svelte';
  import * as d3 from 'd3';

  const dispatch = createEventDispatcher<IEventDispatchMinimap>();

  function boundingBoxToRect(bb: BoundingBox) {
    const min = viewport.worldToScreen().apply(bb.xMin, bb.yMin);
    const max = viewport.worldToScreen().apply(bb.xMax, bb.yMax);
    return { x: min.x, y: min.y, w: max.x - min.x, h: max.y - min.y };
  }

  export let drawable: IDrawableNetwork;
  export let width: number;
  export let height: number;
  export let worldExtent: BoundingBox;

  $: viewport = new Viewport(width, height);
  $: viewport.fit(drawable.boundingBox.padded(2));

  let canvas: HTMLCanvasElement | undefined;
  let svg: SVGSVGElement;

  $: visibleArea = boundingBoxToRect(worldExtent);

  $: if (canvas) {
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 0.5;

    for (const { boundingBox } of drawable.expanded.values()) {
      const r = boundingBoxToRect(boundingBox);
      ctx.fillStyle = 'rgb(250, 250, 250)';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = 'rgb(134, 134, 139)';
      ctx.strokeRect(r.x, r.y, r.w, r.h);
    }

    for (const n of drawable.nodes.values()) {
      const r = boundingBoxToRect(n.boundingBox());
      ctx.fillStyle = 'rgb(134, 134, 139)';
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }

    for (const c of drawable.collapsed.values()) {
      const r = boundingBoxToRect(c.boundingBox());
      ctx.fillStyle = 'rgb(134, 134, 139)';
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
  }

  function handleMinimapNavigation(e: MouseEvent) {
    let screenPoint = svg.createSVGPoint();
    screenPoint.x = e.clientX;
    screenPoint.y = e.clientY;
    screenPoint = screenPoint.matrixTransform(svg.getScreenCTM()?.inverse());
    const center = viewport.screenToWorld().apply(screenPoint.x, screenPoint.y);
    dispatch('viewportCenterDidChange', { center });
  }

  let visibleAreaRect: Element;

  function dragHandler(e: d3.D3DragEvent<Element, unknown, unknown>) {
    const ref = viewport.screenToWorld().apply(0, 0);
    const delta = viewport.screenToWorld().apply(e.dx, e.dy);
    const center = worldExtent.center;
    center.x += delta.x - ref.x;
    center.y += delta.y - ref.y;
    dispatch('viewportCenterDidChange', { center });
  }

  let grabbing = false;
  const drag = d3
    .drag()
    .on('drag', dragHandler)
    .on('start', () => (grabbing = true))
    .on('end', () => (grabbing = false));
  onMount(() => {
    d3.select(visibleAreaRect).call(drag);
  });
</script>

<div class="container">
  <canvas bind:this={canvas} />
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <svg role="navigation" bind:this={svg} {width} {height} on:mousedown={handleMinimapNavigation}>
    <rect
      bind:this={visibleAreaRect}
      fill="rgb(0, 122, 255)"
      x={visibleArea.x}
      y={visibleArea.y}
      width={visibleArea.w}
      height={visibleArea.h}
      opacity="0.1"
      style={grabbing ? 'cursor: grabbing' : 'cursor: grab'}
    />
    <rect
      fill="none"
      stroke="rgb(0, 122, 255)"
      x={visibleArea.x}
      y={visibleArea.y}
      width={visibleArea.w}
      height={visibleArea.h}
    />
  </svg>
</div>

<style>
  .container {
    position: relative;
    border: 1px solid var(--gray-tertiary);
    border-radius: 6px;
    overflow: hidden;
  }

  canvas {
    vertical-align: middle;
  }

  svg {
    position: absolute;
    left: 0;
    top: 0;
    cursor: crosshair;
  }
</style>

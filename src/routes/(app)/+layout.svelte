<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import '../../app.css';

  import { base } from '$app/paths';
  import DragDrop from '../_components/DragDrop.svelte';
</script>

<div class="h-screen flex flex-col">
  <nav class="bg-white shadow py-2 border-b">
    <div class="flex gap-3 mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between">
      <!-- Title -->
      <a class="text-xl space-x-2" href={`${base}/`}>
        <span class="app-name"> Mycelium</span>
      </a>

      <!-- Main Navigation -->
      <div class="">
        <div class="border rounded-lg px-2 py-1 text-xs">
          Drop an <i>.onnx</i> file into the area below to quickly visualize it.
        </div>
      </div>

      <!-- Main Navigation -->
      <div class="flex gap-4 items-center">
        <!--
        TODO: Bring this back once we have a proper release process.
        <div class="border rounded-lg px-2 py-1 text-xs">
          {import.meta.env.DEV ? 'dev' : `v${version}`}
        </div>
        -->
        <span class="text-xs pr-5"
          >Made with ❤️ for <a
            class="text-blue-500 hover:text-blue-600"
            target="_blank"
            href="https://machinelearning.apple.com/research/talaria">Talaria</a
          ></span
        >
        <div class="text-sm space-x-4">
          <a class="text-blue-500 hover:text-blue-600" target="_blank" href="{base}/docs/index.html"
            >Documentation</a
          >
          <a
            class="text-blue-500 hover:text-blue-600"
            target="_blank"
            href="https://www.npmjs.com/package/@apple/mycelium">NPM</a
          >
          <a
            class="text-blue-500 hover:text-blue-600"
            target="_blank"
            href="https://github.com/apple/ml-mycelium">GitHub</a
          >
        </div>
      </div>
    </div>
  </nav>
  <DragDrop>
    <slot />
  </DragDrop>
</div>

<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import '../../app.css';
  import { base } from '$app/paths';
  import DragDrop from '../_components/DragDrop.svelte';

  import { Icon } from '@steeze-ui/svelte-icon';
  import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';
</script>

<DragDrop>
  <div class="bg-white">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <a href={`${base}/`} class="-m-1.5 p-1.5">
            <span class="text-xl"> Mycelium</span>
          </a>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <a
            href="{base}/viewer"
            class="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">Viewer</a
          >
          <a
            href="{base}/gallery"
            class="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">Gallery</a
          >
          <a
            href="{base}/getting-started"
            class="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
            >Getting Started</a
          >
          <a
            href="{base}/docs/index.html"
            class="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
            >Documentation</a
          >
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <a
            href="https://github.com/apple/ml-mycelium"
            class="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
            ><div class="flex gap-1 items-center">
              <span>GitHub</span><Icon
                src={ArrowTopRightOnSquare}
                theme="solid"
                class="text-gray-300 h-4 w-auto"
              />
            </div></a
          >
          <a
            href="https://www.npmjs.com/package/@apple/mycelium"
            class="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
            ><div class="flex gap-1 items-center">
              <span>NPM</span><Icon
                src={ArrowTopRightOnSquare}
                theme="solid"
                class="text-gray-300 h-4 w-auto"
              />
            </div></a
          >
        </div>
      </nav>
    </header>

    <div class="relative isolate pt-14">
      <div
        class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[rgb(237,249,239)] to-[rgb(113,201,117)] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
      <slot />
      <div
        class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[rgb(252,236,235)] to-[rgb(239,90,88)] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
    </div>
  </div>
</DragDrop>

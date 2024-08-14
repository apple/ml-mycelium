<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script>
  import { base } from '$app/paths';

  import { Icon } from '@steeze-ui/svelte-icon';
  import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';
  import Repo from './_components/Repo.svelte';
</script>

<svelte:head>
  <title>Mycelium • Gallery</title>
</svelte:head>

<div class="py-24 sm:py-32 lg:pb-40">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Gallery</h2>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        The following contains examples of different models that can be visualized with Mycelium.
        Please note that some ONNX files can become quite large and need to be downloaded before
        they can be visualized.
      </p>
      <div class="mt-10 grid grid-cols-1 divide-y">
        <div class="flex flex-col py-4 gap-4 w-full">
          <div class="border rounded-lg p-4 flex justify-between items-center">
            <div>LeNet5</div>
            <a
              href="{base}/example/lenet"
              class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >Open</a
            >
          </div>
          <div class="border rounded-lg p-4 flex justify-between items-center">
            <div>GraphViz</div>
            <div class="px-8 text-gray-400 text-sm text-left">Mycelium also comes with a very basic loader for <i>.dot</i> files. Please note that it only works with graphs that form a DAG.</div>
            <a
              href="{base}/example/dot"
              class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >Open</a
            >
          </div>
        </div>

        <div class="flex flex-col py-4 gap-4 w-full">
          <div>
            <div class="font-semibold">External</div>
            <div
              class="mt-2 text-sm text-yellow-600 bg-yellow-50 border rounded-lg border-yellow-400 py-1 px-2"
            >
              The following external models are larger, which is why we only provide external links.
              To visualize them, you can download them and then simply drop them into this page.
            </div>
          </div>
          <div class="border rounded-lg p-4 flex justify-between items-center">
            <Repo org="Microsoft" model="Phi-3-mini-4k-instruct-onnx" /><a
              href="https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx/blob/main/cpu_and_mobile/cpu-int4-rtn-block-32/phi3-mini-4k-instruct-cpu-int4-rtn-block-32.onnx"
              class="rounded-md border border-blue-600 px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              ><div class="flex gap-2 items-center">
                <span>Hugging Face</span><Icon
                  src={ArrowTopRightOnSquare}
                  theme="solid"
                  class="text-blue-600 h-4 w-auto"
                />
              </div></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

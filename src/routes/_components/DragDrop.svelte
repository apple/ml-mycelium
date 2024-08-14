<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { viewerData } from '../stores';

  let isDragTarget = false;

  function handleDragEnter(event: DragEvent) {
    isDragTarget = true;
    event.preventDefault();
  }

  function handleDropFile(event: DragEvent) {
    isDragTarget = false;
    const reader = new FileReader();

    if (event.dataTransfer !== null) {
      const file = event.dataTransfer.files[0];

      reader.onloadend = async function () {
        if (file.name.endsWith(`.onnx`)) {
          viewerData.set({ kind: 'onnx', data: new Uint8Array(this.result as ArrayBuffer) });
        } else if (file.name.endsWith(`.dot`)) {
          viewerData.set({ kind: 'dot', data: this.result as string });
        }
        await goto(`${base}/viewer`);
      };

      if (file.name.endsWith(`.onnx`)) {
        reader.readAsArrayBuffer(file);
      } else if (file.name.endsWith(`.dot`)) {
        reader.readAsText(file);
      } else {
        throw new Error(`unknown extension: ${file.name}`);
      }
    }

    isDragTarget = false;
    event.preventDefault();
  }
</script>

<div
  role="button"
  tabindex="0"
  aria-label="dropzone"
  class="grow"
  class:blur={isDragTarget}
  on:dragenter={handleDragEnter}
  on:dragover={handleDragEnter}
  on:dragleave={() => (isDragTarget = false)}
  on:drop={handleDropFile}
>
  <slot />
</div>

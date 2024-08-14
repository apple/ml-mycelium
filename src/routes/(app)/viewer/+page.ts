// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { LoadEvent } from '@sveltejs/kit';
import { viewerData } from '../../stores';
import { browser } from '$app/environment';

export async function load({ url, fetch }: LoadEvent) {
  const fetchUrl = browser && url.searchParams.get('url');
  if (fetchUrl) {
    const response = await fetch(fetchUrl);
    if (response.url.endsWith('.onnx')) {
      const data = await response.arrayBuffer();
      viewerData.set({ kind: 'onnx', data: new Uint8Array(data) });
    } else if (response.url.endsWith('.dot')) {
      const data = await response.text();
      viewerData.set({ kind: 'dot', data });
    } else {
      throw new Error(`unsupported file format: ${response.url}`);
    }
  }
}

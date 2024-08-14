// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { LoadEvent } from '@sveltejs/kit';
import { base } from '$app/paths';
import { createDotNetworkModel } from '$lib/loader/dot';

export async function load({ fetch }: LoadEvent) {
  const response = await fetch(`${base}/examples/graphviz.dot`);
  const content = await response.text();
  const network = createDotNetworkModel(content);
  return { network };
}

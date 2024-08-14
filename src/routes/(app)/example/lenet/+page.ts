import type { LoadEvent } from '@sveltejs/kit';
import { createNetworkModel } from '$lib/loader/onnx';
import { base } from '$app/paths';

export async function load({ fetch }: LoadEvent) {
  const lenetResponse = await fetch(`${base}/examples/lenet.onnx`)
  const blob = await lenetResponse.arrayBuffer()
  const onnxFile = new Uint8Array(blob);

  const network = createNetworkModel(onnxFile);
  return { network };
}

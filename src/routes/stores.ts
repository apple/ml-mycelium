// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { writable } from 'svelte/store';

export type SupportedFormat = { kind: 'dot'; data: string } | { kind: 'onnx'; data: Uint8Array };

export const viewerData = writable<SupportedFormat | undefined>();

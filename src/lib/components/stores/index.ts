// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { NodeId } from '$lib/network';
import type { Writable } from 'svelte/store';
import type { TooltipStore } from './tooltip';

/** Used to differentiate between Svelte contexts. */
export const viewerKey = Symbol();
export const networkKey = Symbol();

export interface ISelection {
  readonly primaryNodeId: NodeId;
  readonly secondaryIds: Array<NodeId>;
}

export type SelectionStore = Writable<Map<NodeId, Set<NodeId>>>;

export interface IViewerContext {
  selections: SelectionStore;
  tooltips: TooltipStore;
}

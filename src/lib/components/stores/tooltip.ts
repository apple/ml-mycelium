// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { NodeId } from '$lib/network';
import type { Writable } from 'svelte/store';
import type { TooltipDisplayObject } from '$lib/ui/tooltip';

// Number represents a timeout id for the callback that removes the tooltip.
// This is useful if we want to cancel the closing at any point.
export type TooltipState = number | 'active' | 'pinned';

export interface ITooltipWithPositition {
  tooltip: TooltipDisplayObject;
  state: TooltipState;
}

export type TooltipStore = Writable<Map<NodeId, ITooltipWithPositition>>;

const HOVER_DELAY = 300;

export function registerTooltip(
  store: TooltipStore,
  nodeId: NodeId,
  tooltip: TooltipDisplayObject,
) {
  function open() {
    store.update((tooltips) => {
      tooltips.set(nodeId, { tooltip, state: 'active' });
      return tooltips;
    });
  }

  return window.setTimeout(open, HOVER_DELAY);
}

export function keepAliveTooltip(store: TooltipStore, nodeId: NodeId) {
  store.update((tooltips) => {
    const tmp = tooltips.get(nodeId);
    if (tmp !== undefined && tmp.state !== 'pinned') {
      if (tmp.state !== 'active') {
        window.clearTimeout(tmp.state);
      }
      tooltips.set(nodeId, { ...tmp, state: 'active' });
    }
    return tooltips;
  });
}

export function markRemovalTooltip(store: TooltipStore, nodeId: NodeId) {
  function close() {
    store.update((tooltips) => {
      tooltips.delete(nodeId);
      return tooltips;
    });
  }

  store.update((tooltips) => {
    const tmp = tooltips.get(nodeId);
    if (tmp !== undefined && tmp.state !== 'pinned') {
      tooltips.set(nodeId, { ...tmp, state: window.setTimeout(close, HOVER_DELAY) });
    }
    return tooltips;
  });
}

export function togglePinTooltip(store: TooltipStore, nodeId: NodeId) {
  store.update((tooltips) => {
    const tmp = tooltips.get(nodeId);

    if (tmp !== undefined) {
      if (tmp.state === 'pinned') {
        tooltips.set(nodeId, { ...tmp, state: 'active' });
      } else {
        tooltips.set(nodeId, { ...tmp, state: 'pinned' });
      }
    }
    return tooltips;
  });
}

export function unpinTooltip(store: TooltipStore, nodeId: NodeId) {
  keepAliveTooltip(store, nodeId);
}

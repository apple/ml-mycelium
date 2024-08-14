// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { IDrawableModule, NodeDisplayObject } from '$lib/ui/node';
import type { Network, NodeId } from '$lib/network';
import type { EdgesDisplayObject } from '$lib/ui/edge';
import type { BoundingBox } from '$lib/geometry/boundingBox';

export interface ILayoutStats {
  layoutTimeMs?: number;
}

export interface IDrawableNetwork {
  // The following are the different kinds of nodes that we might have in the graph.
  readonly nodes: Map<NodeId, NodeDisplayObject>;
  readonly collapsed: Map<NodeId, NodeDisplayObject>;
  readonly expanded: Map<NodeId, IDrawableModule>;

  readonly edges: EdgesDisplayObject;

  // General information about the layout.
  readonly boundingBox: BoundingBox;
  readonly stats?: ILayoutStats;
}

export interface ILayoutProvider {
  compute(network: Network, collapsed: Set<NodeId>): IDrawableNetwork;
}

export { DagreLayoutProvider } from './dagre';
export * from '../ui/node';

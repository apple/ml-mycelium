// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { NodeId } from '$lib/network';
import type { ISelection } from '$lib/components/stores';
import type { IPoint } from './geometry';

/** @hidden */
export interface IEventNode {
  nodeId: NodeId;
}

/** @hidden */
export interface IEventNodes {
  nodes: Array<NodeId>;
}

/** @hidden */
export interface IEventDispatchNode {
  nodeEnter: IEventNode;
  nodeLeave: IEventNode;
  nodeClick: IEventNode & { original: MouseEvent };
  nodeKeydown: IEventNode;
}

/** @hidden */
export interface IEventDispatchModule {
  collapse: IEventNode;
  expand: IEventNode;
}

export interface IEventSelectionChanged {
  selections: Array<ISelection>;
  previous: Array<ISelection>;
}

/** @hidden */
export interface IEventDispatchSelection {
  selectionDidChange: IEventSelectionChanged;
}

/** @hidden */
export interface IEventMinimapNavigation {
  center: IPoint;
}

/** @hidden */
export interface IEventDispatchMinimap {
  viewportCenterDidChange: IEventMinimapNavigation;
}

/** @hidden */
export interface IEventDispatchBrush {
  brush: IEventNodes;
}

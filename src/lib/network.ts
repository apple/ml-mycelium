// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { Brand } from '$lib/brand';
import { graphlib } from '@dagrejs/dagre';
import type { ui } from '$lib';

/**
 * Uniquely identifies as node in the model graph.
 *
 * The underlying type is a `string`. Additionally, we use {@link Brand} to provide better type support.
 *
 * The following codes creates a {@link NodeId}:
 * @example
 * const nodeId = '42' as NodeId;
 */
export type NodeId = Brand<string, 'NodeId'>;

export interface IEdge {
  from: NodeId;
  to: NodeId;
}

type Edge = { v: NodeId; w: NodeId };

/**
 * Represents a network to be visualized by Mycelium.
 *
 * Inherits from [graphlib](https://github.com/dagrejs/dagre).
 *
 * @example
 * The following snippet shows how to create a simple network:
 * ```
 * const [a, b, c, d, m, n] = ['a', 'b', 'c', 'd', 'm', 'n'] as Array<NodeId>;
 * const network = new Network();
 * network.setNode(n, new ui.Node(n));
 * network.setNodeWithParent(m, new ui.Node(m), n);
 * network.setNode(a, new ui.Node(a));
 * network.setNodeWithParent(b, new ui.Node(b), m);
 * network.setNodeWithParent(c, new ui.Node(c), m);
 * network.setNodeWithParent(d, new ui.Node(d), n);
 * network.setEdge(a, b);
 * network.setEdge(a, c);
 * network.setEdge(b, d);
 * network.setEdge(c, d);
 * ```
 * The information that is shown for each node can be specified in the constructor of {@link ui.Node}.
 */
export class Network extends graphlib.Graph<ui.Node> {
  constructor(graph?: graphlib.Graph<ui.Node>) {
    super({ compound: true });
    if (graph !== undefined) {
      Object.assign(this, graph);
    } else {
      this.setGraph({});
      this.setDefaultEdgeLabel(() => ({}));
    }
  }

  setNodeWithParent(nodeId: NodeId, label: ui.Node, parent: NodeId) {
    this.setNode(nodeId, label);
    this.setParent(nodeId, parent);
  }

  parents(nodeId: NodeId): Array<NodeId> {
    const result = [];
    let current = this.parent(nodeId);
    while (current !== undefined) {
      result.push(current);
      current = this.parent(current);
    }
    return result;
  }

  hierarchyPreorder(nodeId?: NodeId): Array<NodeId> {
    const result: Array<NodeId> = [];
    const root = nodeId !== undefined ? nodeId : this.root();

    const visit = (nodeId: NodeId) => {
      result.push(nodeId);
      for (const child of this.childrenT(nodeId)) {
        visit(child);
      }
    };

    for (const child of this.childrenT(root)) {
      visit(child);
    }

    return result;
  }

  hierarchyPostorder(nodeId?: NodeId): Array<NodeId> {
    const result: Array<NodeId> = [];
    const root = nodeId !== undefined ? nodeId : this.root();

    const visit = (nodeId: NodeId) => {
      for (const child of this.childrenT(nodeId)) {
        visit(child);
      }
      result.push(nodeId);
    };

    for (const child of this.childrenT(root)) {
      visit(child);
    }

    return result;
  }

  /** The types for `graphlib` seem to be wrong so we provide our own `children`
   *  method with correct types. */
  childrenT(nodeId: NodeId): Array<NodeId> {
    return this.children(nodeId) as unknown as Array<NodeId>;
  }

  parent(nodeId: NodeId): NodeId | undefined {
    return super.parent(nodeId) as NodeId | undefined;
  }

  nodes(): Array<NodeId> {
    return super.nodes() as Array<NodeId>;
  }

  modules(): Array<NodeId> {
    return this.nodes().filter((nodeId) => this.childrenT(nodeId).length > 0);
  }

  edges(): Array<Edge> {
    return super.edges() as Array<Edge>;
  }

  root(): NodeId {
    return '\x00' as NodeId;
  }

  toJson(): object {
    return graphlib.json.write(this) as object;
  }

  static readJson(obj: object): Network {
    return new Network(graphlib.json.read(obj) as graphlib.Graph<ui.Node>);
  }
}

export interface ISelectionOptions {
  expand: boolean | 'single';
  collapseOthers: boolean | { threshold: number };
}

/** @hidden */
export function needsModify(
  network: Network,
  selection: Array<NodeId>,
  collapsed: ReadonlySet<NodeId>,
  options: Partial<ISelectionOptions>,
): { collapse: ReadonlySet<NodeId>; expand: ReadonlySet<NodeId> } {
  const untouchedParents: Set<NodeId> = new Set();
  const expand: Set<NodeId> = new Set();
  if (options.expand) {
    for (const nodeId of selection) {
      for (const parent of network.parents(nodeId)) {
        if (collapsed.has(parent)) {
          expand.add(parent);
        } else {
          untouchedParents.add(parent);
        }
      }
    }
  }

  const collapse: Set<NodeId> = new Set();
  if (options.collapseOthers) {
    for (const nodeId of network.modules()) {
      if (!expand.has(nodeId) && !collapsed.has(nodeId) && !untouchedParents.has(nodeId)) {
        collapse.add(nodeId);
      }
    }
  }

  return { collapse, expand };
}

// TODO: This can greatly be simplified once we have a proper hierarchical representation.
/** @hidden */
export function visibleNodesAndModules(network: Network, collapsed: ReadonlySet<NodeId>): number {
  const visibleRec = (nodeId: NodeId): number => {
    if (collapsed.has(nodeId) || network.childrenT(nodeId).length === 0) {
      return 1;
    }
    return network.childrenT(nodeId).reduce((acc, n) => acc + visibleRec(n), 0);
  };

  return network.childrenT(network.root()).reduce((acc, nodeId) => acc + visibleRec(nodeId), 0);
}

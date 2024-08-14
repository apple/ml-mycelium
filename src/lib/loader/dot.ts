// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { NodeRef, NodeRefGroup } from 'ts-graphviz';
import { fromDot } from 'ts-graphviz';
import { ui, type NodeId, Network } from '$lib';

function createNode(nodeId: NodeId): ui.Node {
  return new ui.Node(nodeId, new ui.Text(nodeId).with({ fontWeight: 600 })).with({
    selectable: true,
  });
}

function createModule(nodeId: NodeId): ui.Node {
  return new ui.Node(nodeId, new ui.Text(nodeId).with({ fontWeight: 600 })).with({
    selectable: true,
    backgroundColor: ui.Theme.colors.background.gray,
  });
}

function isNodeRef(target: NodeRef | NodeRefGroup): target is NodeRef {
  return (target as { id?: unknown }).id !== undefined;
}

export function createDotNetworkModel(dot: string): Network {
  const model = fromDot(dot);

  const nodes = new Set<NodeId>();
  for (const e of model.edges) {
    for (const node of e.targets) {
      if (isNodeRef(node)) {
        nodes.add(node.id as NodeId);
      } else {
        console.warn('Node groups are currently node supported.');
      }
    }
  }

  for (const subgraph of model.subgraphs) {
    for (const e of subgraph.edges) {
      for (const node of e.targets) {
        if (isNodeRef(node)) {
          nodes.add(node.id as NodeId);
        } else {
          console.warn('Node groups are currently node supported.');
        }
      }
    }
  }

  const network = new Network();

  for (const node of nodes) {
    network.setNode(node, createNode(node));
  }

  for (const e of model.edges) {
    const [from, to] = e.targets;
    if (isNodeRef(from) && isNodeRef(to)) {
      network.setEdge(from.id as NodeId, to.id as NodeId);
    } else {
      console.warn('Node groups are currently node supported.');
    }
  }

  for (const subgraph of model.subgraphs) {
    const moduleId = subgraph.id as NodeId;
    network.setNode(moduleId, createModule(moduleId));

    for (const e of subgraph.edges) {
      const [from, to] = e.targets;
      if (isNodeRef(from) && isNodeRef(to)) {
        const fromId = from.id as NodeId;
        const toId = to.id as NodeId;
        network.setEdge(fromId, toId);
        network.setParent(fromId, moduleId);
        network.setParent(toId, moduleId);
      } else {
        console.warn('Node groups are currently node supported.');
      }
    }
  }

  return network;
}

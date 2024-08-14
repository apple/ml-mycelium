// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { IDrawableModule, NodeDisplayObject } from '$lib/ui/node';
import { BoundingBox } from '$lib/geometry';
import type { IEdge, Network, NodeId } from '$lib/network';
import dagre from '@dagrejs/dagre';
import type { IDrawableNetwork, ILayoutProvider } from '.';
import { EdgeDisplayObject, EdgesDisplayObject } from '$lib/ui/edge';

export class DagreLayoutProvider implements ILayoutProvider {
  compute(network: Network, collapsed: Set<NodeId>): IDrawableNetwork {
    const graph = new dagre.graphlib.Graph();

    graph.setGraph({});
    graph.setDefaultEdgeLabel(() => ({}));
    graph.setDefaultNodeLabel(() => ({}));

    const nodes: Map<NodeId, NodeDisplayObject> = new Map();
    const collapsedMap: Map<NodeId, NodeDisplayObject> = new Map();
    const expanded: Map<NodeId, IDrawableModule> = new Map();

    const replace = new Map<NodeId, NodeId>();

    // TODO: If we ever wanted to properly pad the bounding boxes this would be the ideal place.
    const nodeCollector = (nodeId: NodeId) => {
      // The type definition of `children` is wrong.
      const children = network.childrenT(nodeId);
      if (children.length === 0) {
        const node = network.node(nodeId).build();
        const { width, height } = node.boundingBox();
        graph.setNode(nodeId, { width, height });
        nodes.set(nodeId, node);
      } else {
        if (!collapsed.has(nodeId) && nodeId !== network.root()) {
          const node = network.node(nodeId);
          expanded.set(nodeId, {
            boundingBox: {} as BoundingBox,
            name: node.humanReadable() || nodeId,
          });
        }
        for (const c of children) {
          if (collapsed.has(c)) {
            for (const skipped of network.hierarchyPreorder(c)) {
              const node = network.node(c).build();
              replace.set(skipped, c);
              const { width, height } = node.boundingBox();
              graph.setNode(c, { width, height });
              collapsedMap.set(c, node);
            }
          } else {
            nodeCollector(c);
          }
        }
      }
    };

    nodeCollector(network.root());

    for (const { v, w } of network.edges()) {
      const newFrom = replace.get(v) || v;
      const newTo = replace.get(w) || w;

      if (newFrom !== newTo) {
        graph.setEdge(newFrom, newTo);
      }
    }

    if (import.meta.env.DEV && !import.meta.env.SSR) {
      console.info(
        `Performing layout of graph with ${graph.nodes().length} nodes and ${
          graph.edges().length
        } edges...`,
      );
    }
    const startTime = performance.now();
    dagre.layout(graph);
    const endTime = performance.now();
    if (import.meta.env.DEV && !import.meta.env.SSR) {
      console.info(`Graph layout took ${(endTime - startTime).toFixed(1)}ms.`);
    }

    // After the layout, these values are guaranteed to be there.
    const { width, height } = graph.graph() as { width: number; height: number };
    const boundingBox = new BoundingBox(0, 0, width, height);

    for (const [nodeId, node] of nodes.entries()) {
      const { x, y, width, height } = graph.node(nodeId);
      node.moveTo(x - width / 2, y - height / 2);
    }

    for (const [nodeId, node] of collapsedMap.entries()) {
      const { x, y, width, height } = graph.node(nodeId);
      node.moveTo(x - width / 2, y - height / 2);
    }

    const padding = 20;

    for (const nodeId of network.hierarchyPostorder()) {
      const module = expanded.get(nodeId);
      if (module !== undefined) {
        const boundingBoxes = network.childrenT(nodeId).reduce<Array<BoundingBox>>((acc, nid) => {
          const nodeBB = nodes.get(nid)?.boundingBox();
          if (nodeBB !== undefined) {
            acc.push(nodeBB);
          }
          const collapsedBB = collapsedMap.get(nid)?.boundingBox();
          if (collapsedBB !== undefined) {
            acc.push(collapsedBB);
          }
          const expandedBB = expanded.get(nid)?.boundingBox;
          if (expandedBB !== undefined && nid !== nodeId) {
            // We add only a fraction of the original padding to expanded bounding boxes.
            const virtualPadding = 2 * -padding + 10;
            const tmp = BoundingBox.fromCenterAndDimension(
              expandedBB.center,
              expandedBB.width + virtualPadding,
              expandedBB.height + virtualPadding,
            );
            acc.push(tmp);
          }
          return acc;
        }, []);
        module.boundingBox = BoundingBox.fromUnion(...boundingBoxes).padded(padding);
      }
    }

    const edgeList = graph
      .edges()
      .map((edgeId: dagre.Edge): [IEdge, EdgeDisplayObject] => {
        const { points } = graph.edge(edgeId);
        return [
          { from: edgeId.v as NodeId, to: edgeId.w as NodeId },
          new EdgeDisplayObject(points),
        ];
      })
      .map(([_, edgeLayout]) => edgeLayout);

    const stats = { layoutTimeMs: endTime - startTime };
    const edges = new EdgesDisplayObject(...edgeList);

    return {
      nodes,
      collapsed: collapsedMap,
      expanded,
      edges,
      boundingBox: boundingBox.union(edges.boundingBox()),
      stats,
    };
  }
}

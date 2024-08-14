// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { Network, type NodeId } from '../network';

import { describe, expect, it } from 'vitest';
import { DagreLayoutProvider } from './dagre';
import { ui } from '$lib';

function dummy(nodeId: NodeId): ui.Node {
  // We set the padding to zero to simpify testing.
  return new ui.Node(nodeId, new ui.Rect(20, 20)).with({ padding: { l: 0, r: 0, b: 0, t: 0 } });
}

function createNetwork() {
  const [a, b, c, d] = ['a', 'b', 'c', 'd'] as Array<NodeId>; // Nodes
  const [m, n] = ['m', 'n'] as Array<NodeId>; // Modules
  const network = new Network();
  network.setNode(n, dummy(n));
  network.setNodeWithParent(m, dummy(m), n);
  network.setNode(a, dummy(a));
  network.setNodeWithParent(b, dummy(b), m);
  network.setNodeWithParent(c, dummy(c), m);
  network.setNodeWithParent(d, dummy(d), n);
  network.setEdge(a, b);
  network.setEdge(a, c);
  network.setEdge(b, d);
  network.setEdge(c, d);
  return network;
}

describe('network with expanded modules', () => {
  const network = createNetwork();
  const drawable = new DagreLayoutProvider().compute(network, new Set());

  it('should have defined dimensions', () => {
    expect(drawable.boundingBox.width).toMatchInlineSnapshot('90');
    expect(drawable.boundingBox.height).toMatchInlineSnapshot('160');
  });

  it('should correct number of nodes', () => {
    expect(drawable.nodes.size).toBe(4);
    expect(drawable.expanded.size).toBe(2);
    expect(drawable.collapsed.size).toBe(0);
  });

  it('should have a defined layout', () => {
    const [a, b, c, d] = ['a', 'b', 'c', 'd'] as Array<NodeId>;
    const nodes = drawable.nodes;
    expect(nodes.get(a)?.boundingBox().center.x).toMatchInlineSnapshot('45');
    expect(nodes.get(a)?.boundingBox().center.y).toMatchInlineSnapshot('10');
    expect(nodes.get(a)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(nodes.get(a)?.boundingBox().height).toMatchInlineSnapshot('20');

    expect(nodes.get(b)?.boundingBox().center.x).toMatchInlineSnapshot('10');
    expect(nodes.get(b)?.boundingBox().center.y).toMatchInlineSnapshot('80');
    expect(nodes.get(b)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(nodes.get(b)?.boundingBox().height).toMatchInlineSnapshot('20');

    expect(nodes.get(c)?.boundingBox().center.x).toMatchInlineSnapshot('80');
    expect(nodes.get(c)?.boundingBox().center.y).toMatchInlineSnapshot('80');
    expect(nodes.get(c)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(nodes.get(c)?.boundingBox().height).toMatchInlineSnapshot('20');

    expect(nodes.get(d)?.boundingBox().center.x).toMatchInlineSnapshot('45');
    expect(nodes.get(d)?.boundingBox().center.y).toMatchInlineSnapshot('150');
    expect(nodes.get(d)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(nodes.get(d)?.boundingBox().height).toMatchInlineSnapshot('20');
  });

  it('should have a defined module boxes', () => {
    const [m, n] = ['m', 'n'] as Array<NodeId>;
    const expanded = drawable.expanded;
    expect(expanded.get(n)?.boundingBox.xMin).toMatchInlineSnapshot('-25');
    expect(expanded.get(n)?.boundingBox.yMin).toMatchInlineSnapshot('45');
    expect(expanded.get(n)?.boundingBox.width).toMatchInlineSnapshot('140');
    expect(expanded.get(n)?.boundingBox.height).toMatchInlineSnapshot('135');

    expect(expanded.get(m)?.boundingBox.xMin).toMatchInlineSnapshot('-20');
    expect(expanded.get(m)?.boundingBox.yMin).toMatchInlineSnapshot('50');
    expect(expanded.get(m)?.boundingBox.width).toMatchInlineSnapshot('130');
    expect(expanded.get(m)?.boundingBox.height).toMatchInlineSnapshot('60');

    // The following should be hidden.
    const collapsed = drawable.collapsed;
    expect(collapsed.get(m)).toBe(undefined);
    expect(collapsed.get(n)).toBe(undefined);
  });
});

describe('network with leaf-level collapsed modules', () => {
  const network = createNetwork();
  const drawable = new DagreLayoutProvider().compute(network, new Set(['m' as NodeId]));

  it('should have defined dimensions', () => {
    expect(drawable.boundingBox.width).toMatchInlineSnapshot('20');
    expect(drawable.boundingBox.height).toMatchInlineSnapshot('160');
  });

  it('should have correct number of nodes when collapsed', () => {
    expect(drawable.nodes.size).toBe(2);
    expect(drawable.expanded.size).toBe(1);
    expect(drawable.collapsed.size).toBe(1);
  });

  it('should have a defined layout', () => {
    const [a, b, c, d] = ['a', 'b', 'c', 'd'] as Array<NodeId>;
    const nodes = drawable.nodes;

    expect(nodes.get(a)?.boundingBox().center.x).toMatchInlineSnapshot('10');
    expect(nodes.get(a)?.boundingBox().center.y).toMatchInlineSnapshot('10');
    expect(nodes.get(a)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(nodes.get(a)?.boundingBox().height).toMatchInlineSnapshot('20');

    expect(nodes.get(d)?.boundingBox().center.x).toMatchInlineSnapshot('10');
    expect(nodes.get(d)?.boundingBox().center.y).toMatchInlineSnapshot('150');
    expect(nodes.get(d)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(nodes.get(d)?.boundingBox().height).toMatchInlineSnapshot('20');

    // The following should be hidden.
    expect(nodes.get(b)).toBe(undefined);
    expect(nodes.get(c)).toBe(undefined);
  });

  it('should have a defined module boxes', () => {
    const [m, n] = ['m', 'n'] as Array<NodeId>;
    const collapsed = drawable.collapsed;
    expect(collapsed.get(m)?.boundingBox().xMin).toMatchInlineSnapshot('0');
    expect(collapsed.get(m)?.boundingBox().yMin).toMatchInlineSnapshot('70');
    expect(collapsed.get(m)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(collapsed.get(m)?.boundingBox().height).toMatchInlineSnapshot('20');

    // The following should be hidden.
    expect(collapsed.get(n)).toBe(undefined);

    const expanded = drawable.expanded;
    expect(expanded.get('m' as NodeId)).toBe(undefined);
  });
});

describe('network with multi-level collapsed modules', () => {
  const network = createNetwork();
  const drawable = new DagreLayoutProvider().compute(network, new Set(['n' as NodeId]));

  it('should have defined dimensions', () => {
    expect(drawable.boundingBox.width).toMatchInlineSnapshot('20');
    expect(drawable.boundingBox.height).toMatchInlineSnapshot('90');
  });

  it('should have correct number of nodes when collapsed', () => {
    expect(drawable.nodes.size).toBe(1);
    expect(drawable.expanded.size).toBe(0);
    expect(drawable.collapsed.size).toBe(1);
  });

  it('should have a defined layout', () => {
    const [a, b, c, d] = ['a', 'b', 'c', 'd'] as Array<NodeId>;
    const nodes = drawable.nodes;
    expect(nodes.get(a)?.boundingBox().center.x).toMatchInlineSnapshot('10');
    expect(nodes.get(a)?.boundingBox().center.y).toMatchInlineSnapshot('10');
    expect(nodes.get(a)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(nodes.get(a)?.boundingBox().height).toMatchInlineSnapshot('20');

    // The following should be hidden.
    expect(nodes.get(b)).toBe(undefined);
    expect(nodes.get(c)).toBe(undefined);
    expect(nodes.get(d)).toBe(undefined);
  });

  it('should have a defined module boxes', () => {
    const [m, n] = ['m', 'n'] as Array<NodeId>;
    const collapsed = drawable.collapsed;
    expect(collapsed.get(n)?.boundingBox().xMin).toMatchInlineSnapshot('0');
    expect(collapsed.get(n)?.boundingBox().yMin).toMatchInlineSnapshot('70');
    expect(collapsed.get(n)?.boundingBox().width).toMatchInlineSnapshot('20');
    expect(collapsed.get(n)?.boundingBox().height).toMatchInlineSnapshot('20');

    // The following should be hidden.
    expect(collapsed.get(m)).toBe(undefined);

    const expanded = drawable.expanded;
    expect(expanded.get('n' as NodeId)).toBe(undefined);
  });
});

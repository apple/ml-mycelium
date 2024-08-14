// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { ui } from '$lib';
import { Network, type NodeId, needsModify, visibleNodesAndModules } from './network';

import { describe, expect, it } from 'vitest';

describe('simple network with modules', () => {
  const [a, b, c, d, m, n] = ['a', 'b', 'c', 'd', 'm', 'n'] as Array<NodeId>;
  const network = new Network();
  network.setNode(n, new ui.Node(n));
  network.setNodeWithParent(m, new ui.Node(m), n);
  network.setNode(a, new ui.Node(a));
  network.setNodeWithParent(b, new ui.Node(b), m);
  network.setNodeWithParent(c, new ui.Node(c), m);
  network.setNodeWithParent(d, new ui.Node(d), n);
  network.setEdge(a, b);
  network.setEdge(a, c);
  network.setEdge(b, d);
  network.setEdge(c, d);

  it('should have the correct parents', () => {
    expect(network.parent(m)).toBe(n);
    expect(network.parent(a)).toBe(undefined);
    expect(network.parent(b)).toBe(m);
    expect(network.parent(c)).toBe(m);
  });

  it('should have the correct path to the root', () => {
    expect(network.parents(b).join('')).toBe('mn');
  });

  it('should have the correct descendants', () => {
    expect(network.hierarchyPreorder(m).sort().join('')).toBe('bc');
    expect(network.hierarchyPreorder(n).sort().join('')).toBe('bcdm');
  });

  it('should list all modules', () => {
    expect(network.modules().sort().join('')).toBe('mn');
  });

  it('should have a correct hierarchical pre-order', () => {
    // Warning! There might be more correct solutions, so if the test fails
    // check the regex in `toMatch` first.
    expect(network.hierarchyPreorder().join('')).toMatch(/nmbcda|anmbcd/);
  });

  it('should have a correct hierarchical pre-order', () => {
    // Warning! There might be more correct solutions, so if the test fails
    // check the regex in `toMatch` first.
    expect(network.hierarchyPostorder().join('')).toMatch(/bcmdna|abcmdn/);
  });
});

describe('selections of nodes in network', () => {
  const [a, b, c, d, e, f, m, n] = ['a', 'b', 'c', 'd', 'e', 'f', 'm', 'n'] as Array<NodeId>;
  const network = new Network();
  network.setNode(a, new ui.Node(a));

  network.setNode(n, new ui.Node(n));
  network.setNode(m, new ui.Node(m));

  network.setNodeWithParent(b, new ui.Node(b), m);
  network.setNodeWithParent(d, new ui.Node(d), m);
  network.setNodeWithParent(c, new ui.Node(c), n);
  network.setNodeWithParent(e, new ui.Node(e), n);
  network.setNodeWithParent(f, new ui.Node(f), n);

  network.setEdge(a, b);
  network.setEdge(a, c);
  network.setEdge(b, d);
  network.setEdge(c, e);
  network.setEdge(e, f);

  it('should not modify on empty selections', () => {
    const collapsed = new Set(network.modules());
    expect(
      needsModify(network, [], collapsed, {
        expand: true,
        collapseOthers: true,
      }),
    ).toEqual({ collapse: new Set(), expand: new Set() });
  });

  it('should expand module', () => {
    const collapsed = new Set([m, n]);
    expect(
      needsModify(network, [d], collapsed, {
        expand: true,
        collapseOthers: true,
      }),
    ).toEqual({ collapse: new Set(), expand: new Set([m]) });
  });

  it('should collapse other module', () => {
    const collapsed: Set<NodeId> = new Set();
    expect(
      needsModify(network, [d], collapsed, {
        expand: true,
        collapseOthers: true,
      }),
    ).toEqual({ collapse: new Set([n]), expand: new Set() });
  });

  it('should populate collapse when provided with threshold', () => {
    const collapsed: Set<NodeId> = new Set();
    expect(
      needsModify(network, [d], collapsed, {
        expand: true,
        collapseOthers: { threshold: 1000 },
      }),
    ).toEqual({ collapse: new Set([n]), expand: new Set() });
  });

  it('should not modify already expanded', () => {
    const collapsed: Set<NodeId> = new Set([m]);
    expect(
      needsModify(network, [e], collapsed, {
        expand: true,
        collapseOthers: true,
      }),
    ).toEqual({ collapse: new Set(), expand: new Set() });
  });
});

describe('visible nodes', () => {
  const [a, b, c, d, m, n] = ['a', 'b', 'c', 'd', 'm', 'n'] as Array<NodeId>;
  const network = new Network();
  network.setNode(n, new ui.Node(n));
  network.setNodeWithParent(m, new ui.Node(m), n);
  network.setNode(a, new ui.Node(a));
  network.setNodeWithParent(b, new ui.Node(b), m);
  network.setNodeWithParent(c, new ui.Node(c), m);
  network.setNodeWithParent(d, new ui.Node(d), n);
  network.setEdge(a, b);
  network.setEdge(a, c);
  network.setEdge(b, d);
  network.setEdge(c, d);

  it('should be properly computed for no collapsed modules', () => {
    expect(visibleNodesAndModules(network, new Set())).toEqual(4);
  });

  it('should be properly computed for collapsed modules', () => {
    expect(visibleNodesAndModules(network, new Set([m]))).toEqual(3);
    expect(visibleNodesAndModules(network, new Set([n]))).toEqual(2);
    expect(visibleNodesAndModules(network, new Set([m, n]))).toEqual(2);
  });
});

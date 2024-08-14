// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Node, Rect } from '.';
import { BoundingBox } from '$lib/geometry';
import type { NodeId } from '$lib';

describe('node display object', () => {
  it('should have correct bounding box after moving', () => {
    const node = new Node('a' as NodeId, new Rect(200, 100)).build();
    expect(node.boundingBox()).toEqual(new BoundingBox(0, 0, 200 + 2 * 8, 100 + 2 * 10));
    node.moveTo(300, 200);
    expect(node.boundingBox()).toEqual(
      new BoundingBox(300, 200, 300 + 200 + 2 * 8, 200 + 100 + 2 * 10),
    );
  });

  it('should have correct bounding boxes for multiple sections', () => {
    const node = new Node('a' as NodeId, new Rect(200, 100), new Rect(300, 100)).build();
    expect(node.boundingBox()).toEqual(new BoundingBox(0, 0, 300 + 2 * 8, 200 + 4 * 10 + 1));
  });
});

// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Padded, Rect, Separator } from '.';
import { BoundingBox } from '$lib/geometry';

describe('padded', () => {
  it('should have correct dimensions', () => {
    const padded = new Rect(100, 80).padded(10);
    expect(padded.build().boundingBox()).toEqual(new BoundingBox(0, 0, 120, 100));
  });

  it('should have correct dimensions in each dimensons', () => {
    const padded = new Rect(100, 80).padded({ l: 5, r: 5, t: 10, b: 10 });
    expect(padded.build().boundingBox()).toEqual(new BoundingBox(0, 0, 110, 100));
  });

  it('should propagate the targetWidth', () => {
    const padded = new Padded(new Separator(), { l: 5, r: 5, t: 10, b: 10 });
    const obj = padded.build({ targetWidth: 100 });
    expect(obj.boundingBox()).toEqual(new BoundingBox(0, 0, 100, 21));
    expect(obj.children.map((o) => o.boundingBox())).toEqual([new BoundingBox(0, 0, 90, 1)]);
  });
});

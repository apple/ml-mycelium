// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { BoundingBox } from '$lib/geometry';
import { describe, expect, it } from 'vitest';
import { positionTooltip } from './tooltip';

describe('tooltip anchor', () => {
  const target = new BoundingBox(0, 0, 100, 200);
  const tooltip = new BoundingBox(0, 0, 30, 50);
  const offset = 20;

  it('should have correct position for `topRight`', () => {
    expect(positionTooltip(target, tooltip, 'topRight', offset)).toEqual({
      x: 120,
      y: 0,
    });
  });

  it('should have correct position for `bottomMiddle`', () => {
    expect(positionTooltip(target, tooltip, 'bottomMiddle', offset)).toEqual({
      x: 35,
      y: 220,
    });
  });
});

// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Separator } from '.';
import { BoundingBox } from '$lib/geometry';

describe('separator', () => {
  it('should have correct dimensions when width is specified', () => {
    expect(new Separator(42).build().boundingBox()).toEqual(new BoundingBox(0, 0, 42, 1));
    expect(new Separator(42).build({ targetWidth: 200 }).boundingBox()).toEqual(
      new BoundingBox(0, 0, 42, 1),
    );
  });

  it('should have fallback width', () => {
    expect(new Separator().build().boundingBox()).toEqual(new BoundingBox(0, 0, 100, 1));
  });

  it('should fill up available space', () => {
    expect(new Separator().build({ targetWidth: 200 }).boundingBox()).toEqual(
      new BoundingBox(0, 0, 200, 1),
    );
  });
});

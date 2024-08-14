// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Rect } from '.';
import { BoundingBox } from '$lib/geometry';

describe('rect', () => {
  it('should have set dimensions', () => {
    expect(new Rect(200, 100).build().boundingBox()).toEqual(new BoundingBox(0, 0, 200, 100));
  });
});

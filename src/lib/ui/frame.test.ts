// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Frame, Rect } from '.';
import { BoundingBox } from '$lib/geometry';

describe('frame', () => {
  it('should have correct dimensions', () => {
    const frame = new Frame(new Rect(200, 100));
    expect(frame.build().boundingBox()).toEqual(new BoundingBox(0, 0, 200, 100));
  });

  it('should not change dimensions when border width is 0', () => {
    const frame = new Frame(new Rect(100, 80)).with({ borderWidth: 0 });
    expect(frame.build().boundingBox()).toEqual(new BoundingBox(0, 0, 100, 80));
  });

  it('should have correct dimensions', () => {
    const frame = new Frame(new Rect(100, 80)).with({ borderWidth: 2 });
    expect(frame.build().boundingBox()).toEqual(new BoundingBox(0, 0, 100, 80));
  });
});

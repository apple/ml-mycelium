// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Viewport } from './viewport';
import { ZoomBehavior } from './zoom';

describe('zoom behavior with scale limits', () => {
  it('should limit scale', () => {
    const viewport = new Viewport(300, 300);
    const zoom = new ZoomBehavior(viewport);

    zoom.setScaleExtent({ min: 0.5, max: 2 });
    zoom.scaleBy(0.001);
    expect(viewport.scale()).toEqual(0.5);
    zoom.scaleTo(5);
    expect(viewport.scale()).toEqual(2);
  });
});

describe('zoom behavior with bounding box limits', () => {
  it('should limit scale', () => {
    const viewport = new Viewport(300, 300);
    const zoom = new ZoomBehavior(viewport);

    zoom.setTranslationExtent({ xMin: 100, yMin: 100, xMax: 200, yMax: 200 });
    zoom.moveTo(50, 50);
    expect(viewport.center()).toEqual({ x: 100, y: 100 });
    zoom.moveTo(50, 150);
    expect(viewport.center()).toEqual({ x: 100, y: 150 });
    zoom.moveTo(150, 50);
    expect(viewport.center()).toEqual({ x: 150, y: 100 });
    zoom.moveTo(250, 50);
    expect(viewport.center()).toEqual({ x: 200, y: 100 });

    zoom.moveBy(50, 50);
    expect(viewport.center()).toEqual({ x: 200, y: 150 });
    zoom.moveBy(50, 50);
    expect(viewport.center()).toEqual({ x: 200, y: 200 });
    zoom.moveBy(-50, 50);
    expect(viewport.center()).toEqual({ x: 150, y: 200 });
    zoom.moveBy(-50, 50);
    expect(viewport.center()).toEqual({ x: 100, y: 200 });
  });
});

// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { BoundingBox } from './boundingBox';
import { Transform } from './transform';

describe('bounding box', () => {
  it('should have proper dimensions', () => {
    const bb = new BoundingBox(100, 100, 120, 110);
    expect(bb.width).toBe(20);
    expect(bb.height).toBe(10);
    expect(bb.center).toEqual({ x: 110, y: 105 });
  });

  it('should be computed from layouts', () => {
    const layouts: Array<BoundingBox> = [
      BoundingBox.fromCenterAndDimension({ x: 0, y: 0 }, 50, 20),
      BoundingBox.fromCenterAndDimension({ x: 25, y: 10 }, 10, 60),
    ];
    expect(BoundingBox.fromUnion(...layouts)).toEqual(new BoundingBox(-25, -20, 30, 40));
    expect(BoundingBox.fromUnion(...layouts).padded(5)).toEqual(new BoundingBox(-30, -25, 35, 45));
  });

  it('should have proper dimensions after padding', () => {
    let bb = new BoundingBox(100, 100, 120, 110).padded(10);
    expect(bb).toEqual(new BoundingBox(90, 90, 130, 120));
    bb = new BoundingBox(100, 100, 120, 110).padded({ l: 1, r: 2, b: 3, t: 4 });
    expect(bb).toEqual(new BoundingBox(99, 96, 122, 113));
  });

  it('should have proper dimensions after transformed', () => {
    const bb = new BoundingBox(-200, -100, 200, 100).transformed(
      Transform.identity().scale(2).translate(200, 100),
    );
    expect(bb).toEqual(new BoundingBox(0, 0, 800, 400));
  });

  it('should be constructable from points', () => {
    const bb = BoundingBox.fromPoints({ x: -200, y: 100 }, { x: 200, y: -100 });
    expect(bb).toEqual(new BoundingBox(-200, -100, 200, 100));
  });

  it('should determine if point is contained', () => {
    const bb = BoundingBox.fromPoints({ x: -200, y: 100 }, { x: 200, y: -100 });
    expect(bb.contains(400, 400)).toEqual(false);
    expect(bb.contains(-400, 400)).toEqual(false);
    expect(bb.contains(400, -400)).toEqual(false);
    expect(bb.contains(-400, -400)).toEqual(false);

    expect(bb.contains(200, 100)).toEqual(true);
    expect(bb.contains(-200, 100)).toEqual(true);
    expect(bb.contains(200, -100)).toEqual(true);
    expect(bb.contains(-200, -100)).toEqual(true);
  });

  it('should determine if another bounding box is enclosed', () => {
    const bb = BoundingBox.fromPoints({ x: -200, y: 100 }, { x: 200, y: -100 });
    expect(bb.encloses(new BoundingBox(-400, -400, 0, 0))).toEqual(false);
    expect(bb.encloses(new BoundingBox(-100, -50, 50, 100))).toEqual(true);
    expect(bb.encloses(new BoundingBox(0, 0, 400, 400))).toEqual(false);
    expect(bb.encloses(new BoundingBox(-400, -400, 400, 400))).toEqual(false);
  });

  it('should determine if it intersects another bounding box', () => {
    const bb = BoundingBox.fromPoints({ x: 100, y: 100 }, { x: 200, y: 200 });
    expect(bb.intersects(new BoundingBox(0, 0, 150, 150))).toEqual(true);
    expect(bb.intersects(new BoundingBox(150, 150, 300, 300))).toEqual(true);
    expect(bb.intersects(new BoundingBox(0, 0, 50, 50))).toEqual(false);
  });
});

describe('infinite bounding box', () => {
  it('should not lead to `NaN`', () => {
    const bb = BoundingBox.infinity();
    expect(bb.center.x).not.toBeNaN();
    expect(bb.center.y).not.toBeNaN();
    expect(bb.width).not.toBeNaN();
    expect(bb.height).not.toBeNaN();
  });
});

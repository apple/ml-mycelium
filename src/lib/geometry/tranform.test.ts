// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Transform } from '.';

describe('transform', () => {
  it('should transform', () => {
    const t = new Transform(200, 300, 2);
    expect(t.apply(1, 1)).toEqual({ x: 202, y: 302 });
  });

  it('should be constructable from identity', () => {
    const t = Transform.identity().translate(200, 300).scale(2);
    expect(t).toEqual({ x: 200, y: 300, k: 2 });
    expect(t.apply(1, 1)).toEqual({ x: 202, y: 302 });
  });

  it('should apply scale correctly', () => {
    const t = Transform.identity().scale(2).scale(2);
    expect(t).toEqual({ x: 0, y: 0, k: 4 });
    expect(t.apply(1, 1)).toEqual({ x: 4, y: 4 });
  });

  it('should apply transition after scale correctly', () => {
    const t = Transform.identity().translate(200, 300).scale(2);
    expect(t.apply(100, 100)).toEqual({ x: 400, y: 500 });
  });

  it('should apply scale after transition correctly', () => {
    const t = Transform.identity().scale(2).translate(200, 300);
    expect(t.apply(100, 100)).toEqual({ x: 600, y: 800 });
  });

  it('should have the correct string representation', () => {
    const t = Transform.identity().translate(200, 300).scale(2);
    expect(t).toEqual({ x: 200, y: 300, k: 2 });
    expect(t.toString()).toEqual('translate(200,300) scale(2)');
  });

  it('should have the correct inverse for translation', () => {
    const t = Transform.identity().translate(200, 300);
    expect(t).toEqual({ x: 200, y: 300, k: 1 });
    expect(t.inverse()).toEqual({ x: -200, y: -300, k: 1 });
    expect(t.inverse().apply(200, 300)).toEqual({ x: 0, y: 0 });
  });

  it('should have the correct inverse for scale', () => {
    const t = Transform.identity().scale(2).scale(2);
    expect(t).toEqual({ x: 0, y: 0, k: 4 });
    expect(t.inverse()).toEqual({ x: 0, y: 0, k: 1 / 4 });
  });

  it('should have the correct inverse for translation and scale', () => {
    const t = Transform.identity().translate(200, 300).scale(2);
    expect(t).toEqual({ x: 200, y: 300, k: 2 });
    expect(t.inverse().apply(400, 600)).toEqual({ x: 100, y: 150 });
  });
});

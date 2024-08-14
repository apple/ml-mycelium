// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { HStack, VStack, Rect, Separator, Padded } from '.';
import { BoundingBox } from '$lib/geometry';

describe('vstack', () => {
  it('should have correct dimensions', () => {
    const stack = new VStack(new Rect(200, 100), new Rect(50, 150), new Rect(30, 10));
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 200, 260));
  });

  it('should take spacing into account', () => {
    const stack = new VStack(new Rect(200, 100), new Rect(50, 150), new Rect(30, 10)).with({
      spacing: 20,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 200, 260 + 2 * 20));
  });

  it('should take `minWidth` into account', () => {
    const stack = new VStack(new Rect(200, 10), new Rect(50, 10), new Rect(30, 10)).with({
      minWidth: 300,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 300, 30));
  });

  it('should take `minWidth` and `maxWidth` into account', () => {
    const stack = new VStack(new Rect(200, 10), new Rect(50, 10), new Rect(30, 10)).with({
      minWidth: 100,
      maxWidth: 100,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 100, 30));
  });

  it('should have at least `minWidth`', () => {
    const stack = new VStack(new Rect(60, 10), new Rect(50, 10), new Rect(30, 10)).with({
      minWidth: 200,
      maxWidth: 210,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 200, 30));
  });
});

describe('hstack', () => {
  it('should have correct dimensions', () => {
    const stack = new HStack(new Rect(200, 100), new Rect(50, 150), new Rect(30, 10));
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 280, 150));
  });

  it('should take spacing into account', () => {
    const stack = new HStack(new Rect(200, 100), new Rect(50, 150), new Rect(30, 10)).with({
      spacing: 20,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 280 + 2 * 20, 150));
  });

  it('should take minWidth into account', () => {
    const stack = new HStack(new Rect(200, 10), new Rect(50, 10), new Rect(30, 10)).with({
      minWidth: 300,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 300, 10));
  });

  it('should take `minWidth` and `maxWidth` into account', () => {
    const stack = new HStack(new Rect(200, 10), new Rect(50, 10), new Rect(30, 10)).with({
      minWidth: 100,
      maxWidth: 100,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 100, 10));
  });

  it('should have at least `minWidth`', () => {
    const stack = new HStack(new Rect(60, 10), new Rect(50, 10), new Rect(30, 10)).with({
      minWidth: 200,
      maxWidth: 210,
    });
    expect(stack.build().boundingBox()).toEqual(new BoundingBox(0, 0, 200, 10));
  });

  it('should have correct positions and dimensions when items are within targetWidth', () => {
    const stack = new HStack(new Rect(100, 20), new Rect(100, 20), new Rect(100, 20)).with({
      spacing: 10,
      spread: true,
    });
    const obj = stack.build({ targetWidth: 500 });
    expect(obj.children.map((c) => ({ x: c.transform.x, y: c.transform.y }))).toEqual([
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 400, y: 0 },
    ]);
    expect(obj.boundingBox()).toEqual(new BoundingBox(0, 0, 500, 20));
  });

  it('should have correct positions and dimensions when exceeding targetWidth', () => {
    const stack = new HStack(new Rect(200, 20), new Rect(200, 20), new Rect(200, 20)).with({
      spacing: 10,
      spread: true,
    });
    const obj = stack.build({ targetWidth: 500 });
    expect(obj.children.map((c) => ({ x: c.transform.x, y: c.transform.y }))).toEqual([
      { x: 0, y: 0 },
      { x: 210, y: 0 },
      { x: 420, y: 0 },
    ]);
    expect(obj.boundingBox()).toEqual(new BoundingBox(0, 0, 620, 20));
  });
});

describe('context', () => {
  it('targetWidth should work for VStack', () => {
    const stack = new VStack(new Rect(200, 100), new Separator(), new Rect(300, 100)).build();
    expect(stack.boundingBox()).toEqual(new BoundingBox(0, 0, 300, 201));
    expect(stack.children.map((c) => c.boundingBox())).toEqual([
      new BoundingBox(0, 0, 200, 100),
      new BoundingBox(0, 0, 300, 1),
      new BoundingBox(0, 0, 300, 100),
    ]);
  });

  it('targetWidth should work for VStack with padded', () => {
    const stack = new VStack(
      new Padded(new Rect(200, 100), { l: 10, r: 10, b: 0, t: 0 }),
      new Separator(),
      new Padded(new Rect(300, 100), { l: 10, r: 10, b: 0, t: 0 }),
    ).build();
    expect(stack.boundingBox()).toEqual(new BoundingBox(0, 0, 320, 201));
    expect(stack.children.map((c) => c.boundingBox())).toEqual([
      new BoundingBox(0, 0, 220, 100),
      new BoundingBox(0, 0, 320, 1),
      new BoundingBox(0, 0, 320, 100),
    ]);
  });
});

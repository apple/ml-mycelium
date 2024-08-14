// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { Viewport } from './viewport';
import { BoundingBox } from './geometry/boundingBox';

describe('viewport', () => {
  it('should start of as the identity', () => {
    const viewport = new Viewport(640, 480);
    const bb = BoundingBox.fromCenterAndDimension({ x: 0, y: 0 }, 640, 480);
    expect(viewport.world()).toEqual(bb);
  });

  it('should have the correct position after moving', () => {
    const viewport = new Viewport(500, 500);
    expect(viewport.center()).toEqual({ x: 0, y: 0 });
    viewport.moveBy(250, 250);
    expect(viewport.center()).toEqual({ x: 250, y: 250 });
    viewport.scaleBy(2);
    expect(viewport.center()).toEqual({ x: 250, y: 250 });
    viewport.moveTo(0, 500);
    expect(viewport.center()).toEqual({ x: 0, y: 500 });
  });

  it('should transform from world to view', () => {
    const viewport = new Viewport(640, 480);
    expect(viewport.worldToView().apply(0, 0)).toEqual({ x: 0, y: 0 });
    expect(viewport.worldToView().apply(320, 240)).toEqual({ x: 320, y: 240 });
    viewport.moveBy(320, 240);
    expect(viewport.worldToView().apply(320, 240)).toEqual({ x: 0, y: 0 });
    viewport.moveBy(-640, -480);
    expect(viewport.worldToView().apply(320, 240)).toEqual({ x: 640, y: 480 });
  });

  it('should transform from view to world', () => {
    const viewport = new Viewport(640, 480);
    expect(viewport.viewToWorld().apply(0, 0)).toEqual({ x: 0, y: 0 });
    expect(viewport.viewToWorld().apply(320, 240)).toEqual({ x: 320, y: 240 });
    viewport.moveBy(320, 240);
    expect(viewport.viewToWorld().apply(0, 0)).toEqual({ x: 320, y: 240 });
    viewport.moveBy(-640, -480);
    expect(viewport.viewToWorld().apply(640, 480)).toEqual({ x: 320, y: 240 });
  });

  it('should transform from screen to view', () => {
    const viewport = new Viewport(640, 480);
    expect(viewport.screenToView().apply(0, 0)).toEqual({ x: -320, y: -240 });
    expect(viewport.screenToView().apply(320, 240)).toEqual({ x: 0, y: 0 });
    expect(viewport.screenToView().apply(640, 480)).toEqual({ x: 320, y: 240 });
    viewport.moveBy(320, 240);
    // The following should stay identical.
    expect(viewport.screenToView().apply(0, 0)).toEqual({ x: -320, y: -240 });
    viewport.scaleBy(2);
    expect(viewport.screenToView().apply(0, 0)).toEqual({ x: -160, y: -120 });
    expect(viewport.screenToView().apply(320, 240)).toEqual({ x: 0, y: 0 });
    expect(viewport.screenToView().apply(640, 480)).toEqual({ x: 160, y: 120 });
  });

  it('should transform from screen to view', () => {
    const viewport = new Viewport(640, 480);
    expect(viewport.viewToScreen().apply(-320, -240)).toEqual({ x: 0, y: 0 });
    expect(viewport.viewToScreen().apply(0, 0)).toEqual({ x: 320, y: 240 });
    expect(viewport.viewToScreen().apply(320, 240)).toEqual({ x: 640, y: 480 });
    viewport.moveBy(320, 240);
    // The following should stay identical.
    expect(viewport.viewToScreen().apply(-320, -240)).toEqual({ x: 0, y: 0 });
    viewport.scaleBy(2);
    expect(viewport.viewToScreen().apply(-160, -120)).toEqual({ x: 0, y: 0 });
    expect(viewport.viewToScreen().apply(0, 0)).toEqual({ x: 320, y: 240 });
    expect(viewport.viewToScreen().apply(160, 120)).toEqual({ x: 640, y: 480 });
  });

  it('should transform from world to screen', () => {
    const viewport = new Viewport(640, 480);
    expect(viewport.worldToScreen().apply(0, 0)).toEqual({ x: 320, y: 240 });
    viewport.moveTo(320, 240);
    viewport.scaleTo(2);
    expect(viewport.worldToScreen().apply(160, 120)).toEqual({ x: 0, y: 0 });
    expect(viewport.worldToScreen().apply(480, 360)).toEqual({ x: 640, y: 480 });
  });

  it('should transform from screen to world', () => {
    const viewport = new Viewport(640, 480);
    expect(viewport.screenToWorld().apply(320, 240)).toEqual({ x: 0, y: 0 });
    viewport.moveTo(320, 240);
    viewport.scaleTo(2);
    expect(viewport.screenToWorld().apply(0, 0)).toEqual({ x: 160, y: 120 });
    expect(viewport.screenToWorld().apply(640, 480)).toEqual({ x: 480, y: 360 });
  });

  it('should fit to a bounding box', () => {
    const viewport = new Viewport(640, 480);
    viewport.fit(new BoundingBox(0, 0, 1200, 1200));
    expect(viewport.center()).toEqual({ x: 600, y: 600 });
    expect(viewport.worldToScreen().apply(0, 0)).toEqual({ x: 80, y: 0 });
    expect(viewport.worldToScreen().apply(1200, 1200)).toEqual({ x: 560, y: 480 });
  });

  it('should fit to a bounding box with padding', () => {
    const viewport = new Viewport(640, 480);
    viewport.fit(new BoundingBox(0, 0, 1200, 1200).padded(50));
    expect(viewport.center()).toEqual({ x: 600, y: 600 });
  });

  it('should have the correct world extent', () => {
    const viewport = new Viewport(500, 500);
    const bb = new BoundingBox(200, 100, 450, 350);
    viewport.fit(bb);
    expect(viewport.world()).toEqual(bb);
  });

  it('should have the correct viewBox string', () => {
    const viewport = new Viewport(500, 500);
    const bb = new BoundingBox(200, 100, 450, 350);
    viewport.fit(bb);
    expect(viewport.viewBox()).toEqual('200 100 250 250');
  });
});

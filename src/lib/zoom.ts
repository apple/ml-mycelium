// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { BoundingBox, type IPoint } from './geometry';
import { clamp } from './std';
import type { Viewport } from './viewport';

/** Acts as a proxy to control the viewport. */
export class ZoomBehavior {
  private scaleMin: number = Number.MIN_VALUE;
  private scaleMax: number = Number.MAX_VALUE;
  private boundingBox: BoundingBox = BoundingBox.infinity();

  constructor(private viewport: Viewport) {}

  setViewport(viewport: Viewport) {
    this.viewport = viewport;
  }

  setScaleExtent(limits: { min?: number; max?: number }): this {
    if (limits.min !== undefined) {
      this.scaleMin = limits.min;
    }
    if (limits.max !== undefined) {
      this.scaleMax = limits.max;
    }
    return this;
  }

  scaleExtent(): { min: number; max: number } {
    return { min: this.scaleMin, max: this.scaleMax };
  }

  setTranslationExtent(limits: {
    xMin?: number;
    yMin?: number;
    xMax?: number;
    yMax?: number;
  }): this {
    if (limits.xMin !== undefined) {
      this.boundingBox.xMin = limits.xMin;
    }
    if (limits.yMin !== undefined) {
      this.boundingBox.yMin = limits.yMin;
    }
    if (limits.xMax !== undefined) {
      this.boundingBox.xMax = limits.xMax;
    }
    if (limits.yMax !== undefined) {
      this.boundingBox.yMax = limits.yMax;
    }
    return this;
  }

  translationExtent(): BoundingBox {
    return this.boundingBox;
  }

  private limitScale(k: number): number {
    return clamp(this.scaleMin, this.scaleMax, k);
  }

  private limitTranslation(x: number, y: number): IPoint {
    x = clamp(this.boundingBox.xMin, this.boundingBox.xMax, x);
    y = clamp(this.boundingBox.yMin, this.boundingBox.yMax, y);
    return { x, y };
  }

  scaleBy(k: number) {
    const curr = this.limitScale(this.viewport.scale() * k);
    this.viewport.scaleTo(curr);
  }

  scaleTo(k: number) {
    const curr = this.limitScale(k);
    this.viewport.scaleTo(curr);
  }

  moveBy(dx: number, dy: number) {
    const { x, y } = this.viewport.center();
    const curr = this.limitTranslation(x + dx, y + dy);
    this.viewport.moveTo(curr.x, curr.y);
  }

  moveTo(x: number, y: number) {
    const curr = this.limitTranslation(x, y);
    this.viewport.moveTo(curr.x, curr.y);
  }
}

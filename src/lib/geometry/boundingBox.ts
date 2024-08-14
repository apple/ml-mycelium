// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { IPadding, IPoint, Transform } from '.';

export class BoundingBox {
  constructor(
    public xMin: number,
    public yMin: number,
    public xMax: number,
    public yMax: number,
  ) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
  }

  static infinity(): BoundingBox {
    return new BoundingBox(Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
  }

  isEmpty() {
    return (
      this.xMin === Number.MAX_VALUE ||
      this.yMin === Number.MAX_VALUE ||
      this.xMax === Number.MIN_VALUE ||
      this.yMax === Number.MIN_VALUE
    );
  }

  static fromCenterAndDimension(center: IPoint, width: number, height: number): BoundingBox {
    return new BoundingBox(
      center.x - width / 2,
      center.y - height / 2,
      center.x + width / 2,
      center.y + height / 2,
    );
  }

  static fromPoints(...points: Array<IPoint>): BoundingBox {
    return points.reduce((acc, p) => {
      acc.xMin = Math.min(acc.xMin, p.x);
      acc.yMin = Math.min(acc.yMin, p.y);
      acc.xMax = Math.max(acc.xMax, p.x);
      acc.yMax = Math.max(acc.yMax, p.y);
      return acc;
    }, BoundingBox.infinity());
  }

  static fromUnion(...boxes: Array<BoundingBox>): BoundingBox {
    return boxes.reduce((acc, bb) => acc.union(bb), BoundingBox.infinity());
  }

  get width(): number {
    return this.xMax - this.xMin;
  }

  get height(): number {
    return this.yMax - this.yMin;
  }

  get center(): IPoint {
    return { x: this.xMin + this.width / 2, y: this.yMin + this.height / 2 };
  }

  padded(padding: number | IPadding): BoundingBox {
    const { l, r, b, t } =
      typeof padding === 'object' ? padding : { l: padding, r: padding, t: padding, b: padding };
    return new BoundingBox(this.xMin - l, this.yMin - t, this.xMax + r, this.yMax + b);
  }

  union(other: BoundingBox): BoundingBox {
    return new BoundingBox(
      Math.min(this.xMin, other.xMin),
      Math.min(this.yMin, other.yMin),
      Math.max(this.xMax, other.xMax),
      Math.max(this.yMax, other.yMax),
    );
  }

  transformed(transform: Transform): BoundingBox {
    const minT = transform.apply(this.xMin, this.yMin);
    const maxT = transform.apply(this.xMax, this.yMax);
    return new BoundingBox(minT.x, minT.y, maxT.x, maxT.y);
  }

  contains(x: number, y: number): boolean {
    return this.xMin <= x && this.yMin <= y && x <= this.xMax && y <= this.yMax;
  }

  encloses(other: BoundingBox): boolean {
    return this.contains(other.xMin, other.yMin) && this.contains(other.xMax, other.yMax);
  }

  intersects(other: BoundingBox): boolean {
    return (
      (this.xMin <= other.xMin && other.xMin <= this.xMax) ||
      (this.xMin <= other.xMax && other.xMax <= this.xMax) ||
      (this.yMin <= other.yMin && other.yMin <= this.yMax) ||
      (this.yMin <= other.yMax && other.yMax <= this.yMax)
    );
  }
}

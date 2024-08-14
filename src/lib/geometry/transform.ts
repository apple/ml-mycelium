// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { IPoint } from '.';

export class Transform {
  x: number;
  y: number;
  k: number;

  constructor(x: number, y: number, k: number) {
    this.x = x;
    this.y = y;
    this.k = k;
  }

  static identity(): Transform {
    return new Transform(0, 0, 1);
  }

  translate(x: number, y: number): Transform {
    return x === 0 && y === 0
      ? this
      : new Transform(this.x + this.k * x, this.y + this.k * y, this.k);
  }

  scale(k: number): Transform {
    return k === 1 ? this : new Transform(this.x, this.y, this.k * k);
  }

  apply(x: number, y: number): IPoint {
    return { x: x * this.k + this.x, y: y * this.k + this.y };
  }

  inverse(): Transform {
    return Transform.identity()
      .scale(1 / this.k)
      .translate(-this.x, -this.y);
  }

  toString(): string {
    return `translate(${this.x},${this.y}) scale(${this.k})`;
  }
}

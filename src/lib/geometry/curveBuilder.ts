// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

// This class is adapted from Lutz Roeder's Netron, which is MIT licensed, so this should be fine.
// Adapted from https://github.com/lutzroeder/netron/blob/22ffd4eaeb4ca9c4d0478263310fe9072371c284/source/grapher.js#L605-L681.

import * as d3 from 'd3';
import type { IPoint } from '$lib/geometry';

enum State {
  Init = 0,
  StartingPoint,
  StraightLine,
  Curve,
}

export class CurveBuilder {
  private readonly context = d3.path();
  private x0 = NaN;
  private x1 = NaN;
  private y0 = NaN;
  private y1 = NaN;
  private state: State = State.Init;

  constructor(points: Array<IPoint>) {
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      this.point(point.x, point.y);
      if (i === points.length - 1) {
        switch (this.state) {
          case State.Curve:
            this.curve(this.x1, this.y1);
            this.context.lineTo(this.x1, this.y1);
            break;
          case State.StraightLine:
            this.context.lineTo(this.x1, this.y1);
            break;
          default:
            break;
        }
      }
    }
  }

  private point(x: number, y: number) {
    x = +x;
    y = +y;
    switch (this.state) {
      case State.Init:
        this.state = State.StartingPoint;
        this.context.moveTo(x, y);
        break;
      case State.StartingPoint:
        this.state = 2;
        break;
      case State.StraightLine:
        this.state = 3;
        this.context.lineTo((5 * this.x0 + this.x1) / 6, (5 * this.y0 + this.y1) / 6);
        this.curve(x, y);
        break;
      default:
        this.curve(x, y);
        break;
    }
    this.x0 = this.x1;
    this.x1 = x;
    this.y0 = this.y1;
    this.y1 = y;
  }

  private curve(x: number, y: number) {
    this.context.bezierCurveTo(
      (2 * this.x0 + this.x1) / 3,
      (2 * this.y0 + this.y1) / 3,
      (this.x0 + 2 * this.x1) / 3,
      (this.y0 + 2 * this.y1) / 3,
      (this.x0 + 4 * this.x1 + x) / 6,
      (this.y0 + 4 * this.y1 + y) / 6,
    );
  }

  build(): string {
    return this.context.toString();
  }
}

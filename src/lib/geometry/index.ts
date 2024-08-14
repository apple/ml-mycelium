// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

/** Describes a 2D point. */
export interface IPoint {
  x: number;
  y: number;
}

export interface IPadding {
  l: number;
  r: number;
  t: number;
  b: number;
}

export { Transform } from './transform';
export { CurveBuilder } from './curveBuilder';
export { BoundingBox } from './boundingBox';

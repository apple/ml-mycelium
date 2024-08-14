// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { BoundingBox, type IPoint, Transform } from './geometry';

export class Viewport {
  constructor(
    private width: number,
    private height: number,
    private cameraPos: IPoint = { x: 0, y: 0 },
    private cameraScale = 1,
  ) {}

  /// The camera transform that places the camera in world space.
  viewToWorld(): Transform {
    return Transform.identity().translate(this.cameraPos.x, this.cameraPos.y);
  }

  /// The view transformation, i.e. the inverse camera matrix.
  worldToView(): Transform {
    return this.viewToWorld().inverse();
  }

  screenToView(): Transform {
    return Transform.identity()
      .scale(1 / this.cameraScale)
      .translate(-this.width / 2, -this.height / 2);
  }

  viewToScreen(): Transform {
    return this.screenToView().inverse();
  }

  worldToScreen(): Transform {
    const view = this.worldToView();
    return this.viewToScreen().scale(view.k).translate(view.x, view.y);
  }

  screenToWorld(): Transform {
    return this.worldToScreen().inverse();
  }

  screenWidth(): number {
    return this.width;
  }

  screenHeight(): number {
    return this.height;
  }

  /** Translates the viewport in world coordinates */
  moveBy(dx: number, dy: number) {
    this.cameraPos.x += dx;
    this.cameraPos.y += dy;
  }

  moveTo(x: number, y: number) {
    this.cameraPos.x = x;
    this.cameraPos.y = y;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /** The center of the `Viewport` in world coordinates. */
  center(): Readonly<IPoint> {
    return this.cameraPos;
  }

  scale(): number {
    return this.cameraScale;
  }

  scaleBy(k: number) {
    this.cameraScale *= k;
  }

  scaleTo(k: number) {
    this.cameraScale = k;
  }

  /** Moves and scales the camera so that the `boundingBox` (in world coordinates) is visible. */
  fit(boundingBox: BoundingBox) {
    const { x, y } = boundingBox.center;
    this.moveTo(x, y);
    const scaleTo = Math.min(this.width / boundingBox.width, this.height / boundingBox.height);
    this.scaleTo(scaleTo || 1); // We should never scale to 0
  }

  world(): BoundingBox {
    const min = this.screenToWorld().apply(0, 0);
    const max = this.screenToWorld().apply(this.width, this.height);
    return new BoundingBox(min.x, min.y, max.x, max.y);
  }

  viewBox(): string {
    const bb = this.world();
    return `${bb.xMin} ${bb.yMin} ${bb.width} ${bb.height}`;
  }
}

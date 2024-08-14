// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { BoundingBox } from '$lib/geometry';
import { Container, DisplayObject } from '$lib/scene';
import { Theme, type IRectOptions, Rect } from '.';
import { WithOptions, type IViewBuilder } from './builder';
import type { IBuildContext } from './context';
import type { RectDisplayObject } from './rect';

// TODO: Implement `Frame` based on `ZStack` and `Rect`.
export class Frame extends WithOptions<IRectOptions> implements IViewBuilder {
  constructor(private readonly inner: IViewBuilder) {
    super({
      backgroundColor: Theme.colors.white,
      borderColor: Theme.colors.foreground.grayTertiary,
      borderWidth: 1,
      borderDash: undefined,
      radius: undefined,
    });
  }

  content(): IViewBuilder {
    return this.inner;
  }

  /** @hidden */
  build(ctx: Partial<IBuildContext> = {}): FrameDisplayObject {
    const displayObject = this.inner.build(ctx);
    const bbox = displayObject.boundingBox();
    return new FrameDisplayObject(
      displayObject,
      new Rect(bbox.width, bbox.height).with(this.options).build(ctx),
    );
  }
}

/** @hidden */
export class FrameDisplayObject extends Container {
  constructor(content: DisplayObject, rect: RectDisplayObject) {
    super(rect, content);
  }

  boundingBox(): BoundingBox {
    return super.boundingBox();
  }
}

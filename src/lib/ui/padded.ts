// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { BoundingBox, IPadding } from '$lib/geometry';
import { Container, type DisplayObject, type DisplayObjectComponent } from '$lib/scene';
import type { IViewBuilder } from './builder';
import type { IBuildContext } from './context';
import SvelteContainer from '$lib/components/elements/Container.svelte';

function isPadding(padding: number | IPadding): padding is IPadding {
  return (padding as { l?: unknown }).l !== undefined;
}

export class Padded implements IViewBuilder {
  private readonly p: IPadding;

  constructor(
    private readonly inner: IViewBuilder,
    padding: number | IPadding,
  ) {
    this.inner = inner;
    this.p = isPadding(padding) ? padding : { l: padding, r: padding, t: padding, b: padding };
  }

  content(): IViewBuilder {
    return this.inner;
  }

  padding(): IPadding {
    return this.p;
  }

  /** @hidden */
  build(ctx: Partial<IBuildContext> = {}): PaddedDisplayObject {
    const { l, t, r } = this.p;
    const displayObject = ctx.targetWidth
      ? this.inner.build({ ...ctx, targetWidth: ctx.targetWidth - l - r })
      : this.inner.build({ ...ctx });

    displayObject.moveTo(l, t);
    return new PaddedDisplayObject(displayObject, this.p);
  }
}

/** @hidden */
export class PaddedDisplayObject extends Container {
  readonly padding: IPadding;

  constructor(inner: DisplayObject, padding: IPadding) {
    super(inner);
    this.padding = padding;
  }

  boundingBox(): BoundingBox {
    return super.boundingBox().padded(this.padding);
  }

  drawable(): DisplayObjectComponent {
    return SvelteContainer;
  }
}

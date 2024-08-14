// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { BoundingBox, type IPadding } from '$lib/geometry';
import { clamp } from '$lib/std';
import { type IViewBuilder, WithOptions } from './builder';
import { Padded } from '.';
import { Container, type DisplayObject } from '$lib/scene';
import type { IBuildContext } from './context';

export interface IStackOptions {
  spacing: number;
  spread: boolean;
  minWidth: number;
  maxWidth: number;
}

export class HStack extends WithOptions<IStackOptions> implements IViewBuilder {
  private readonly children: Array<IViewBuilder>;

  constructor(...children: Array<IViewBuilder>) {
    super({
      spacing: 0,
      spread: false,
      minWidth: Number.MIN_VALUE,
      maxWidth: Number.MAX_VALUE,
    });
    this.children = children;
  }

  /** @hidden */
  build(ctx: Partial<IBuildContext> = {}): Container {
    const children = this.children.map((child) => child.build(ctx));

    let filler = 0;
    if (this.options.spread && ctx.targetWidth !== undefined) {
      const numGaps = children.length - 1;
      const width = children.reduce(
        (acc, c) => acc + c.boundingBox().width,
        this.options.spacing * numGaps,
      );
      const leftoverSpace = ctx.targetWidth - width;
      filler = Math.max(leftoverSpace / (this.children.length - 1), 0);
    }

    const currentPos = { x: 0, y: 0 };
    for (const child of children) {
      child.moveTo(currentPos.x, currentPos.y);
      currentPos.x += child.boundingBox().width + this.options.spacing + filler;
    }

    return new StackContainer(this.options, ...children);
  }
}

export class VStack extends WithOptions<IStackOptions> implements IViewBuilder {
  private readonly children: Array<IViewBuilder>;

  constructor(...children: Array<IViewBuilder>) {
    super({
      spacing: 0,
      spread: false,
      minWidth: Number.MIN_VALUE,
      maxWidth: Number.MAX_VALUE,
    });
    this.children = children;
  }

  padded(padding: number | IPadding): Padded {
    return new Padded(this, padding);
  }

  /** @hidden */
  build(ctx: Partial<IBuildContext> = {}): StackContainer {
    const maxWidth = Math.max(
      this.options.minWidth,
      this.children.reduce(
        (acc, child) => Math.max(acc, child.build(ctx).boundingBox().width),
        -Infinity,
      ),
    );
    const children = this.children.map((child) => child.build({ ...ctx, targetWidth: maxWidth }));

    const currentPos = { x: 0, y: 0 };
    for (const child of children) {
      child.moveTo(currentPos.x, currentPos.y);
      currentPos.y += child.boundingBox().height + this.options.spacing;
    }

    return new StackContainer(this.options, ...children);
  }
}

/** @hidden */
export class StackContainer extends Container {
  constructor(
    readonly options: IStackOptions,
    ...children: Array<DisplayObject>
  ) {
    super(...children);
    this.options = options;
  }

  boundingBox(): BoundingBox {
    const bbox = super.boundingBox();
    bbox.xMax = clamp(this.options.minWidth, this.options.maxWidth, bbox.xMax);
    return bbox;
  }
}

/** Centers the children by default. */
export class ZStack implements IViewBuilder {
  private readonly children: Array<IViewBuilder>;
  constructor(...children: Array<IViewBuilder>) {
    this.children = children;
  }

  /** @hidden */
  build(ctx: Partial<IBuildContext> = {}): Container {
    const children = this.children.map((c) => c.build(ctx));
    const { width, height } = BoundingBox.fromUnion(...children.map((c) => c.boundingBox()));
    for (const c of children) {
      const { width: cw, height: ch } = c.boundingBox();
      c.moveTo(width / 2 - cw / 2, height / 2 - ch / 2);
    }
    return new Container(...children);
  }
}

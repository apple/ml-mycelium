// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import SvelteRect from '$lib/components/elements/Rect.svelte';
import { BoundingBox, type IPadding } from '$lib/geometry';
import { DisplayObject, type DisplayObjectComponent } from '$lib/scene';
import { Padded, Theme } from '.';
import { WithOptions, type IViewBuilder } from './builder';
import type { IBuildContext } from './context';

export interface IRectOptions {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderDash: number | undefined;
  radius: number | undefined;
}

export class Rect extends WithOptions<IRectOptions> implements IViewBuilder {
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    super({
      backgroundColor: Theme.colors.black,
      borderColor: 'none',
      borderWidth: 0,
      borderDash: undefined,
      radius: undefined,
    });
    this.width = width;
    this.height = height;
  }

  padded(padding: number | IPadding): Padded {
    return new Padded(this, padding);
  }

  /** @hidden */
  build(_ctx: Partial<IBuildContext> = {}): RectDisplayObject {
    return new RectDisplayObject(this.width, this.height, this.options);
  }
}

/** @hidden */
export class RectDisplayObject extends DisplayObject {
  constructor(
    readonly width: number,
    readonly height: number,
    readonly options: IRectOptions,
  ) {
    super();
  }

  boundingBox(): BoundingBox {
    return new BoundingBox(0, 0, this.width, this.height);
  }

  drawable(): DisplayObjectComponent {
    return SvelteRect;
  }
}

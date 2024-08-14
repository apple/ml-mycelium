// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { Theme } from '.';
import { WithOptions, type IViewBuilder } from './builder';
import type { IBuildContext } from './context';
import { RectDisplayObject } from './rect';

const SEPARATOR_HEIGHT = 1;

// TODO: This fallback is not nice. We should come up with a way to encode the
//       presence of `ctx.targetWidth` in the type system.
const SEPARATOR_WIDTH_DEFAULT = 100;

export interface ISeparatorOptions {
  color: string;
  dash: number | undefined;
}

export class Separator extends WithOptions<ISeparatorOptions> implements IViewBuilder {
  readonly width: number | undefined;

  constructor(width?: number) {
    super({
      color: Theme.colors.foreground.grayTertiary,
      dash: undefined,
    });
    this.width = width;
  }

  /** @hidden */
  build(ctx: Partial<IBuildContext> = {}): RectDisplayObject {
    const width = this.width || ctx.targetWidth || SEPARATOR_WIDTH_DEFAULT;
    return new RectDisplayObject(width, SEPARATOR_HEIGHT, {
      backgroundColor: this.options.color,
      borderColor: 'none',
      borderWidth: 0,
      radius: undefined,
      borderDash: this.options.dash,
    });
  }
}

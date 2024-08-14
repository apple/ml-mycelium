// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import SvelteText from '$lib/components/elements/Text.svelte';
import { BoundingBox, type IPadding } from '$lib/geometry';
import { DisplayObject, type DisplayObjectComponent } from '$lib/scene';
import { Padded, Theme } from '.';
import { WithOptions, type IViewBuilder } from './builder';
import { CanvasContext, type IBuildContext } from './context';

export interface ITextOptions {
  foregroundColor?: string;
  font: string;
  fontSize: number;
  fontWeight: 200 | 500 | 600;
}

export class Text extends WithOptions<ITextOptions> implements IViewBuilder {
  private readonly text: string;

  constructor(text: string) {
    super({ font: Theme.font.family, fontSize: 16, fontWeight: 200 });
    this.text = text;
  }

  padded(padding: number | IPadding): Padded {
    return new Padded(this, padding);
  }

  /** @hidden */
  build(ctx?: Partial<IBuildContext>): TextDisplayObject {
    return new TextDisplayObject(this.text, { ...ctx?.defaultOptions?.text, ...this.options });
  }
}

/** @hidden */
export class TextDisplayObject extends DisplayObject {
  readonly text: string;
  readonly options: ITextOptions;
  private readonly width: number;
  private readonly height: number;

  constructor(text: string, options: ITextOptions) {
    super();
    this.text = text;
    this.options = options;
    this.width = new CanvasContext().measureTextWidth(this.text, this.options);
    this.height = options.fontSize;
  }

  boundingBox(): BoundingBox {
    return new BoundingBox(0, 0, this.width, this.height);
  }

  drawable(): DisplayObjectComponent {
    return SvelteText;
  }
}

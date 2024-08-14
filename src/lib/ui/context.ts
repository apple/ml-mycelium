// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { ITextOptions } from '.';

export class CanvasContext {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  measureTextWidth(text: string, options: ITextOptions): number {
    // If this becomes a performance bottleneck, we can always cache the text and font.
    this.ctx.font = `${options.fontSize}px ${options.font}`;
    this.ctx.textBaseline = 'top';
    const measure = this.ctx.measureText(text);
    return measure.width;
  }
}

export interface IBuildContext {
  readonly targetHeight: number;
  readonly targetWidth: number;

  readonly defaultOptions: Partial<{ text: Partial<ITextOptions> }>;
}

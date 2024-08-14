// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { BoundingBox, IPoint } from '$lib/geometry';
import { DisplayObject, type DisplayObjectComponent } from '$lib/scene';
import { Theme } from '.';
import { WithOptions, type IViewBuilder } from './builder';
import type { IBuildContext } from './context';
import { Frame, Padded } from '.';

export type Anchor = 'topRight' | 'bottomMiddle';

const PADDING = { l: 8, r: 8, t: 10, b: 10 };

/** @hidden */
export function positionTooltip(
  target: BoundingBox,
  tooltip: BoundingBox,
  anchor: Anchor,
  offset: number,
): IPoint {
  switch (anchor) {
    case 'topRight':
      return { x: target.xMax + offset, y: target.yMin };
    case 'bottomMiddle':
      return { x: target.center.x - tooltip.width / 2, y: target.yMax + offset };
  }
}

export interface ITooltipOptions {
  anchor: Anchor;
}

export class Tooltip extends WithOptions<ITooltipOptions> implements IViewBuilder {
  private readonly content: IViewBuilder;

  constructor(content: IViewBuilder) {
    super({ anchor: 'topRight' });
    this.content = content;
  }

  build(_ctx: Partial<IBuildContext> = {}): TooltipDisplayObject {
    return new TooltipDisplayObject(
      new Frame(new Padded(this.content, PADDING))
        .with({ radius: 6, borderColor: 'none', backgroundColor: Theme.colors.background.darkGray })
        .build({ defaultOptions: { text: { foregroundColor: 'white' } } }),
      this.options,
    );
  }
}

/** @hidden */
export class TooltipDisplayObject extends DisplayObject {
  constructor(
    readonly content: DisplayObject,
    readonly options: ITooltipOptions,
  ) {
    super();
  }

  boundingBox(): BoundingBox {
    return this.content.boundingBox().padded(PADDING);
  }

  drawable(): DisplayObjectComponent {
    // TODO: Fix this
    throw Error('not implemented');
  }
}

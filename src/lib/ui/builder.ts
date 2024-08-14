// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { DisplayObject } from '$lib/scene';
import type { IBuildContext } from './context';

/** Helper class that makes developing the builders in {@link ui} more convenient. */
export abstract class WithOptions<T> {
  protected options: T;

  constructor(options: T) {
    this.options = options;
  }

  with(options: Partial<T>): this {
    this.options = { ...this.options, ...options };
    return this;
  }
}

/** @hidden */
export interface IViewBuilder {
  build(ctx: Partial<IBuildContext>): DisplayObject;
}

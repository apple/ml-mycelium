// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { Transform, BoundingBox } from '$lib/geometry';
import type { SvelteComponent } from 'svelte';
import SvelteContainer from '$lib/components/elements/Container.svelte';

/** @hidden */
export type DisplayObjectProps = { self: DisplayObject };
/** @hidden */
export type DisplayObjectComponent = new (...args: any[]) => SvelteComponent<DisplayObjectProps>; // eslint-disable-line @typescript-eslint/no-explicit-any

export class DisplayObjectEvents {
  onClick?: (event: MouseEvent) => void;
}

/** @hidden */
export abstract class DisplayObject extends DisplayObjectEvents {
  transform: Transform;

  constructor() {
    super();
    this.transform = Transform.identity();
  }

  moveTo(x: number, y: number) {
    this.transform.x = x;
    this.transform.y = y;
  }

  abstract boundingBox(): BoundingBox;
  abstract drawable(): DisplayObjectComponent;
}

export class Container<T extends DisplayObject = DisplayObject> extends DisplayObject {
  children: Array<T>;

  constructor(...children: Array<T>) {
    super();
    this.children = children;
  }

  boundingBox(): BoundingBox {
    return BoundingBox.fromUnion(
      ...this.children.map((c) => c.boundingBox().transformed(c.transform)),
    );
  }

  drawable(): DisplayObjectComponent {
    return SvelteContainer;
  }
}

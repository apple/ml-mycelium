// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import SvelteEdge from '$lib/components/graph/Edge.svelte';
import { Container, DisplayObject, type DisplayObjectComponent } from '$lib/scene';
import { BoundingBox, CurveBuilder, type IPoint } from '$lib/geometry';
import type { IViewBuilder } from './builder';

export class Edge implements IViewBuilder {
  constructor(readonly points: Array<IPoint>) {
    this.points = points;
  }

  build(): DisplayObject {
    return new EdgeDisplayObject(this.points);
  }
}

/** @hidden */
export class EdgeDisplayObject extends DisplayObject {
  readonly points: Array<IPoint>;

  constructor(points: Array<IPoint>) {
    super();
    this.points = points;
  }

  path(): string {
    const transformed = this.points.map((p) => this.transform.apply(p.x, p.y));
    return new CurveBuilder(transformed).build();
  }

  boundingBox(): BoundingBox {
    return BoundingBox.fromPoints(...this.points);
  }

  drawable(): DisplayObjectComponent {
    return SvelteEdge;
  }
}

/** @hidden */
export class EdgesDisplayObject extends Container<EdgeDisplayObject> {}

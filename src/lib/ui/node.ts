// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { NodeId } from '../network';
import type { BoundingBox } from '../geometry/boundingBox';
import SvelteNode from '$lib/components/Node.svelte';
import { DisplayObject, type DisplayObjectComponent } from '../scene';
import { Theme, type Tooltip, Padded, HStack, Text, Separator, VStack } from '.';
import { WithOptions, type IViewBuilder } from './builder';
import type { IBuildContext } from './context';
import type { IPadding } from '$lib/geometry';
import { intersperse } from '$lib/std';

export interface INodeOptions {
  selectable: boolean;
  tooltip: (() => Tooltip) | undefined;
  badge:
    | {
        color: string;
        /** Right now we only support strings of length <= 2. */
        text?: string;
      }
    | undefined;
  borderDash: number | undefined;
  borderColor: string;
  backgroundColor: string;
  humanReadable: string | undefined;
  padding: IPadding;
}

function defaultNode(name: string) {
  return new HStack(new Text(name)).with({ minWidth: 30 });
}

/**
 * A builder that describes a Node in the Network.
 *
 * The visual representation of a node can be specified by using instances of {@link IViewBuilder}.
 * If this parameter is not specified, the node will show only the {@link NodeId}, or the {@link INodeOptions.humanReadable} option, if specified.
 *
 * @example
 * const n = new ui.Node(
 *   "42" as NodeId,
 *   new ui.Text('Node 42')    // This text will be shown inside the node.
 * ).with({
 *   selectable: true,         // If `true`, selection events will be emitted for this node.
 *   humanReadable: 'Node 42', // This will be shown in the breadcrumb bar.
 * });
 */
export class Node extends WithOptions<INodeOptions> implements IViewBuilder {
  private readonly contents: Array<IViewBuilder>;

  /**
   * Represents a node in the graph.
   * @param nodeId A unique identifier for the node.
   * @param contents A collection of `IViewBuilder` which will be interspersed with `ui.Separator` elements.
   * When this collection is empty we resort to the `humanReadable` description or the node. If `humanReadable` is also not defined then we show the `nodeId`.
   */
  constructor(
    readonly nodeId: NodeId,
    ...contents: Array<IViewBuilder>
  ) {
    super({
      selectable: false,
      borderDash: undefined,
      badge: undefined,
      tooltip: undefined,
      backgroundColor: Theme.colors.white,
      borderColor: Theme.colors.foreground.grayTertiary,
      humanReadable: undefined,
      padding: { l: 8, r: 8, t: 10, b: 10 },
    });
    this.contents =
      contents.length > 0 ? contents : [defaultNode(this.options.humanReadable || this.nodeId)];
  }

  humanReadable(): Readonly<string> | undefined {
    return this.options.humanReadable;
  }

  /** @hidden */
  build(ctx: Partial<IBuildContext> = {}): NodeDisplayObject {
    const prepared = [
      ...intersperse(
        this.contents.map((c) => new Padded(c, this.options.padding)),
        new Separator().with({
          color: this.options.borderColor,
          dash: this.options.borderDash,
        }) as IViewBuilder,
      ),
    ];

    return new NodeDisplayObject(this.nodeId, new VStack(...prepared).build(ctx), this.options);
  }
}

/** @hidden */
export class NodeDisplayObject extends DisplayObject {
  constructor(
    readonly nodeId: NodeId,
    readonly content: DisplayObject,
    readonly options: INodeOptions,
  ) {
    super();
  }

  boundingBox(): BoundingBox {
    return this.content.boundingBox().transformed(this.transform);
  }

  drawable(): DisplayObjectComponent {
    return SvelteNode;
  }
}

export interface IDrawableModule {
  boundingBox: BoundingBox;
  name: string;
}

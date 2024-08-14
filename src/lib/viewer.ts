// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import type { ISelectionOptions, Network, NodeId } from './network';
import Mycelium from './components/Mycelium.svelte';
import type { IEventSelectionChanged } from './events';
import { DagreLayoutProvider, type ILayoutProvider } from './layout';
import type { IRectOptions } from './ui';

// For some reason, Eslint does not pick up the types with `strict-type-checked` enabled.
declare type MyceliumStrict = Mycelium & {
  setSelections: (nodeIds: Array<NodeId>, options?: Partial<ISelectionOptions>) => Promise<void>;
  collapseAll: () => Promise<void>;
  clearSelections: () => Promise<void>;
  setFocus: (target: NodeId | Array<NodeId>, transition?: boolean) => Promise<void>;
  resetFocus: (transition?: boolean) => Promise<void>;
};

/**
 * Represents an instance of the Mycelium viewer.
 */
export interface INetworkViewerOptions {
  width: number;
  height: number;
  showBreadcrumbs: boolean;
  showResetView: boolean;
  watermark: boolean;
  minimap: boolean;
  /**
   * Allows to customize the layout algorithm. This API is still experimental and might be subject to changes in the future.
   * @experimental
   * @typeParam @internal ILayoutProvider
   */
  layoutProvider: ILayoutProvider;
  autoResize: boolean;
  multiSelection: boolean;
}

export class NetworkViewer {
  private readonly decorations: Map<NodeId, Partial<IRectOptions>>;

  private constructor(
    private readonly app: MyceliumStrict,
    private readonly options: INetworkViewerOptions,
  ) {
    this.decorations = new Map();
  }

  /**
   * Creates an instance of the Mycelium viewer and attaches it to the DOM.
   */
  static create(
    network: Network,
    domElement: HTMLElement,
    options?: Partial<INetworkViewerOptions>,
  ): NetworkViewer {
    // Define default options and overwrite with set options.
    const opts: INetworkViewerOptions = {
      width: domElement.getBoundingClientRect().width,
      height: domElement.getBoundingClientRect().height,
      autoResize: true,
      showBreadcrumbs: true,
      showResetView: true,
      watermark: true,
      minimap: true,
      layoutProvider: new DagreLayoutProvider(),
      multiSelection: true,
      ...options,
    };

    if (opts.watermark) {
      console.info('╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮');
      console.info('| Powered by the Mycelium network     |');
      console.info('| visualizer. For more information:   |');
      console.info('| https://apple.github.io/ml-mycelium |');
      console.info('╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯');
    }

    const app = new Mycelium({
      target: domElement,
      props: { network, ...opts },
    }) as MyceliumStrict;

    if (opts.autoResize) {
      const resizeObserver = new ResizeObserver(() => {
        app.$set({ width: domElement.clientWidth, height: domElement.clientHeight });
      });

      resizeObserver.observe(domElement);
    }

    return new NetworkViewer(app, opts);
  }

  onSelectionDidChange(listener: (event: IEventSelectionChanged) => void) {
    this.app.$on('selectionDidChange', (e: CustomEvent<IEventSelectionChanged>) => {
      listener(e.detail);
    });
  }

  async setSelection(nodeId: NodeId, option?: Partial<ISelectionOptions>) {
    await this.app.setSelections([nodeId], option);
  }

  async setSelections(nodeIds: Array<NodeId>, option?: Partial<ISelectionOptions>) {
    await this.app.setSelections(nodeIds, option);
  }

  async collapseAll() {
    await this.app.collapseAll();
  }

  async clearSelections() {
    await this.app.clearSelections();
  }

  /** Changes the view so that `target` is in the center.
   *  @param target The `NodeId` of the node that the viewer will focus on.
   *                If `target` is undefined, the view will be reset to show the entire graph.
   */
  async setFocus(target: NodeId | Array<NodeId>, transition?: boolean) {
    await this.app.setFocus(target, transition);
  }

  async resetFocus(transition?: boolean) {
    await this.app.resetFocus(transition);
  }

  setDecoration(nodeId: NodeId, decoration: Partial<IRectOptions>) {
    this.decorations.set(nodeId, decoration);
    this.app.$set({ decorations: this.decorations });
  }

  removeDecoration(nodeId: NodeId) {
    this.decorations.delete(nodeId);
    this.app.$set({ decorations: this.decorations });
  }

  clearDecorations() {
    this.decorations.clear();
    this.app.$set({ decorations: this.decorations });
  }

  setNetwork(network: Network) {
    this.app.$set({ network, collapsed: new Set(network.modules()) });
  }

  getOptions(): INetworkViewerOptions {
    return this.options;
  }
}

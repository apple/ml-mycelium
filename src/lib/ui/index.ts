// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

/**
 * Provides builders to construct contents of {@link Node} and {@link Tooltip}.
 * @module ui
 *
 * The following shows a brief example of creating a {@link Node} with custom content:
 * @example
 * const node = new ui.Node(
 *   nodeId,
 *   new ui.VStack(
 *     new ui.Text('Node').with({ fontWeight: 600 }),
 *     new ui.Text(nodeId),
 *   ),
 * ).with({
 *   backgroundColor: ui.Theme.GRAY_BACKGROUND,
 *   tooltip: () => new ui.Text('This is a new'),
 * });
 */

export * as Theme from './theme';
export * from './stack';
export * from './tooltip';
export * from './frame';
export * from './edge';
export * from './text';
export * from './node';
export * from './rect';
export * from './padded';
export * from './separator';

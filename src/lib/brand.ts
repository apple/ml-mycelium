// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

/**
 * We use branded types to discern type aliases.
 *
 * An example for this is {@link NodeId}.
 */
export type Brand<K, T> = K & { __brand: T };

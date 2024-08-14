// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

// @vitest-environment jsdom

import { describe, expect, test } from 'vitest';
import { CanvasContext } from './context';
import type { ITextOptions } from '.';

describe.skip('context', () => {
  test('should measure text', () => {
    const ctx = new CanvasContext();
    const options: ITextOptions = {
      fontSize: 12,
      font: 'Arial',
      fontWeight: 200,
    };
    expect(ctx.measureTextWidth('Hello World', options)).toMatchInlineSnapshot(51.50390625);
  });
});

// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { Text } from '.';

describe.skip('text', () => {
  it('should have correct dimensions', () => {
    const text = new Text('Hello World').with({ font: '', fontSize: 16, fontWeight: 200 });
    expect(text.build().boundingBox()).toMatchInlineSnapshot({
      width: 82.40625,
      height: 16,
    });
  });
});

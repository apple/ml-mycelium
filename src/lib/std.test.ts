// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { chunks, clamp, intersperse } from './std';

describe('chunks', () => {
  it('should split inputs that are multiple of size', () => {
    expect(chunks('abcdef', 3)).toEqual(['abc', 'def']);
  });

  it('should properly handle leftovers', () => {
    expect(chunks('abcde', 3)).toEqual(['abc', 'de']);
  });

  it('should return empty array on empty strings', () => {
    expect(chunks('', 3)).toEqual([]);
  });

  it('should throw an error for chunks of size 0', () => {
    expect(() => chunks('abcdef', 0)).toThrowErrorMatchingInlineSnapshot(
      `[Error: chunks of size \`0\` or smaller are not allowed]`,
    );
  });
});

describe('clamp', () => {
  it('should respect upper and lower bounds', () => {
    expect(clamp(17, 42, 50)).toEqual(42);
    expect(clamp(17, 42, 1)).toEqual(17);
    expect(clamp(17, 42, 25)).toEqual(25);
  });
});

describe('intersperse', () => {
  it('should intersperse the delimiter', () => {
    expect([...intersperse(['a', 'b', 'c'], '-')]).toEqual(['a', '-', 'b', '-', 'c']);
  });

  it('should not add anything to an empty array', () => {
    expect([...intersperse([], '-')]).toEqual([]);
  });
});

// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

export function chunks(input: string, size: number): Array<string> {
  if (size <= 0) {
    throw new Error('chunks of size `0` or smaller are not allowed');
  }
  let start = 0;
  let end = size;
  const result: Array<string> = [];
  while (end < input.length) {
    result.push(input.slice(start, end));
    start += size;
    end += size;
  }
  if (start < input.length) {
    result.push(input.slice(start));
  }
  return result;
}

// Taken from https://stackoverflow.com/a/37129036 (CC BY-SA 3.0)
export function* intersperse<T>(arr: Array<T>, delimiter: T) {
  let first = true;
  for (const x of arr) {
    if (!first) yield delimiter;
    first = false;
    yield x;
  }
  return;
}

export function clamp(a: number, b: number, x: number): number {
  return Math.min(Math.max(x, a), b);
}

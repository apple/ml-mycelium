// For licensing see accompanying LICENSE file.
// Copyright (C) 2024 Apple Inc. All Rights Reserved.

import { describe, expect, it } from 'vitest';
import { WithOptions } from './builder';

class Test extends WithOptions<{ text: string }> {
  constructor() {
    super({ text: 'initial' });
  }

  text(): string {
    return this.options.text;
  }
}

describe('builder options', () => {
  it('should by correctly applied', () => {
    const t = new Test();
    expect(t.text()).toEqual('initial');
    t.with({ text: 'overwritten' });
    expect(t.text()).toEqual('overwritten');
  });
});

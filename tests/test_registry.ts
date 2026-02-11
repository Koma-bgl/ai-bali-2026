import { expect, test } from 'vitest';
import { registry } from '@/registry';

test('registry definition', () => {
  expect(registry).toBeDefined();
  expect(Object.keys(registry).length).toBeGreaterThan(0);

  // Example: Check if the Text component is in the registry
  expect(registry.Text).toBeDefined();
});
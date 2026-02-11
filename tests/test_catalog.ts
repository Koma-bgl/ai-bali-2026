import { expect, test } from 'vitest';
import { catalog } from '../src/catalog';

test('catalog definition', () => {
  expect(catalog.components).toBeDefined();
  expect(catalog.actions).toBeDefined();

  // Example: Check if the Text component is defined
  expect(catalog.components.Text).toBeDefined();

  // Example: Check the schema of the Text component
  expect(catalog.components.Text.schema).toBeDefined();

  // Example: Validate the schema with a valid object
  const validProps = { content: 'Hello, world!' };
  expect(catalog.components.Text.schema.safeParse(validProps).success).toBe(true);

  // Example: Validate the schema with an invalid object
  const invalidProps = { content: 123 };
  expect(catalog.components.Text.schema.safeParse(invalidProps).success).toBe(false);

    const validProps2 = { content: 'Hello, world!' };
    expect(catalog.components.Text.schema.parse(validProps2)).toEqual(validProps2);
});
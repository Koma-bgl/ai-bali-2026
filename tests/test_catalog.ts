import { describe, it, expect } from 'vitest';
import catalog, { Catalog } from '../src/catalog';

describe('catalog', () => {
  it('should define a catalog with the Text component', () => {
    expect(catalog).toBeDefined();
    expect(catalog.components.Text).toBeDefined();
  });

  it('should have a schema for the Text component', () => {
    expect(catalog.components.Text.schema).toBeDefined();
  });

  it('should have actions for the Text component', () => {
    expect(catalog.components.Text.actions).toBeDefined();
    expect(catalog.components.Text.actions.setState).toBeDefined();
  });

  it('should validate the schema for the Text component', () => {
    const validProps = { content: 'Hello, world!' };
    expect(catalog.components.Text.schema.safeParse(validProps).success).toBe(true);

    const invalidProps = { content: 123 };
    expect(catalog.components.Text.schema.safeParse(invalidProps).success).toBe(false);
  });
});

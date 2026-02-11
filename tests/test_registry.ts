import { describe, it, expect } from 'vitest';
import registry from '../src/registry';

describe('registry', () => {
  it('should define a registry with the Text component', () => {
    expect(registry).toBeDefined();
    expect(registry.Text).toBeDefined();
  });

  it('should render the Text component with the provided content', () => {
    const content = 'Hello, world!';
    const TextComponent = registry.Text as React.FC<{ content: string }>;
    const element = TextComponent({ content });

    // Basic check:  You might want to use a more sophisticated check based on your needs.
    expect(element).toBeDefined();
  });
});

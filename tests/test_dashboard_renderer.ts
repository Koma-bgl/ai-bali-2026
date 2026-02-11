import { expect, test, describe, it, vi } from 'vitest';
import DashboardRenderer from '@/components/DashboardRenderer';
import { registry } from '@/registry';
import { catalog } from '@/catalog';
import React from 'react';


describe('DashboardRenderer', () => {
  it('should render the Renderer component with the correct spec and registry', () => {
    const spec = { component: 'Text', props: { content: 'Hello, world!' } };

    // Mock the Renderer component to check if it's called with the right props
    const RendererMock = vi.fn().mockImplementation(({ spec, registry }) => {
        return <div data-testid="renderer">{spec.props.content}</div>; // Render the content for testing purposes
    });

    // Replace the actual Renderer in DashboardRenderer with the mock
    const originalRenderer = registry.Text;

    const wrapper = () => <DashboardRenderer spec={spec} />;

    const { unmount } = render(wrapper());

    (registry.Text as any) = RendererMock; // type assertion necessary as Text is not a function normally

    expect(RendererMock).toHaveBeenCalledTimes(0);

    (registry.Text as any) = originalRenderer;
    unmount();
  });
});

import { render, screen } from '@testing-library/react';

describe('DashboardRenderer integration', () => {
  it('renders the specified component with props', () => {
    const spec = {
      component: 'Text',
      props: { content: 'Hello, world!' },
    };

    render(<DashboardRenderer spec={spec} />);

    // Use screen.getByText to find the rendered content
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
});

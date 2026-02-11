import { describe, it, expect } from 'vitest';
import DashboardRenderer from '../src/components/DashboardRenderer';
import { render } from '@testing-library/react';
import React from 'react';


describe('DashboardRenderer', () => {
  it('should render without errors', () => {
    const spec = {
      component: 'Text',
      props: { content: 'Hello, world!' },
    };
    const { container } = render(<DashboardRenderer spec={spec} />);
    expect(container).toBeInTheDocument();
  });

  it('should render the component based on the spec', () => {
    const spec = {
      component: 'Text',
      props: { content: 'Hello, world!' },
    };

    const { getByText } = render(<DashboardRenderer spec={spec} />);

    expect(getByText('Hello, world!')).toBeInTheDocument();
  });
});
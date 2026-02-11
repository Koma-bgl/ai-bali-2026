import { describe, it, expect } from 'vitest'
import DashboardRenderer from '@/components/DashboardRenderer'

describe('DashboardRenderer', () => {
  it('should render without errors with a basic spec', () => {
    const spec = {
      component: 'Text',
      props: { content: 'Hello, World!' },
    }

    // Since we are not testing the actual rendering, but rather that the component
    // can receive props and not throw an error, we don't need to mount the component.
    // This test is purely for checking prop passing and basic component structure.
    expect(() => DashboardRenderer({ spec })).not.toThrowError()
  })

  // it('should throw an error if spec is missing', () => {
  //   expect(() => DashboardRenderer({} as any)).toThrowError()
  // })

  // it('should throw an error if component is not defined in registry', () => {
  //   const spec = {
  //     component: 'NonExistentComponent',
  //     props: {},
  //   }
  //   expect(() => DashboardRenderer({ spec })).toThrowError()
  // })
})

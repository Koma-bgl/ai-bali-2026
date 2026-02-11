import { defineCatalog } from '@json-render/react';
import { z } from 'zod';

const catalog = defineCatalog({
  components: {
    Text: {
      schema: z.object({ content: z.string() }),
      actions: {
        setState: () => {},
      },
    },
  },
});

export type Catalog = typeof catalog;
export default catalog;
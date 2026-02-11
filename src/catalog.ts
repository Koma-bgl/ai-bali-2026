import { defineCatalog, ZodActions, ZodComponent, ZodProps } from '@json-render/react';
import { z } from 'zod';

export type Catalog = {
  components: {
    Text: ZodComponent<{
      content: z.ZodString;
    }>;
  };
  actions: {
    setState: ZodActions<any>;
  };
};

export const catalog = defineCatalog<Catalog>({
  components: {
    Text: {
      schema: z.object({ content: z.string() }),
      actions: {
        setState: () => {},
      },
    },
  },
  actions: {
    setState: () => {},
  },
});

export type CatalogType = typeof catalog
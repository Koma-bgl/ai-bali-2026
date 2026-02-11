import { defineCatalog } from '@json-render/core';
import { z } from 'zod';

const TextSchema = z.object({ content: z.string() });

export const catalog = defineCatalog({
  components: {
    Text: {
      schema: TextSchema,
    },
  },
  actions: {
    setState: z.function(
      z.tuple([z.string(), z.any()]),
      z.void()
    ),
  },
});

export type CatalogType = typeof catalog
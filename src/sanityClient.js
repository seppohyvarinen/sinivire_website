import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'z955eyim',   // from sanity.io/manage
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})
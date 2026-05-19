import { defineType, defineField } from 'sanity'

const page = defineType({
  name: 'page',
  title: 'Page content',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Main headline',
      description: 'The big text visitors see first',
      type: 'string',
    }),

    // ── ABOUT SECTION ──────────────────────────
    defineField({
      name: 'about',
      title: 'About section',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'About us text',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'therapists',
          title: 'Therapists',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Therapist',
              preview: { select: { title: 'name', media: 'image' } },
              fields: [
                defineField({ name: 'name', title: 'Name', type: 'string' }),
                defineField({
                  name: 'image',
                  title: 'Photo',
                  type: 'image',
                  options: { hotspot: true },
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── SERVICES SECTION ──────────────────────────
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Service',
          preview: { select: { title: 'name', media: 'image' } },
          fields: [
            defineField({ name: 'name', title: 'Service name', type: 'string' }),
            defineField({
              name: 'shortDescription',
              title: 'Short description',
              description: 'A brief summary shown in cards or previews (1–2 sentences)',
              type: 'string',
            }),
            defineField({
              name: 'longDescription',
              title: 'Long description',
              description: 'Full details shown on the service page',
              type: 'text',
              rows: 5,
            }),
            defineField({
              name: 'image',
              title: 'Service image',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
        },
      ],
    }),

    // ── RESEARCH SECTION ──────────────────────────
    defineField({
      name: 'research',
      title: 'Research',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Research item',
          preview: { select: { title: 'title' } },
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'abstract',
              title: 'Abstract',
              type: 'text',
              rows: 6,
            }),
            defineField({
              name: 'link',
              title: 'Link',
              description: 'URL to the full research paper or resource',
              type: 'url',
              validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
            }),
          ],
        },
      ],
    }),

    // ── HERO IMAGE ──────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      description: 'Main background or feature image',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── CONTACT ──────────────────────────
    defineField({
      name: 'contact',
      title: 'Contact email',
      type: 'string',
    }),
  ],
})

export const schemaTypes = [page]
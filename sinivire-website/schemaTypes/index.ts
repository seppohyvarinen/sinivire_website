import { defineType, defineField } from 'sanity'

const page = defineType({
  name: 'page',
  title: 'Sivun sisältö',
  type: 'document',
  fields: [

defineField({
  name: 'title',
  title: 'Dokumentin nimi',
  type: 'string',
  initialValue: 'Sinivire Oy — sivun sisältö',
  readOnly: true,
}),
        // ── SERVICES SECTION ──────────────────────────
    defineField({
      name: 'services',
      title: 'Palvelut',
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

    // ── ABOUT SECTION ──────────────────────────
    defineField({
      name: 'about',
      title: 'Keitä Olemme? -osio',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Valinnainen yleinen kuvaus',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'therapists',
          title: 'Terapeuttien esittelyt',
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
    // ── APPLYING SECTION ──────────────────────────
defineField({
  name: 'applying',
  title: 'Hakeminen -osio',
  type: 'object',
  fields: [
    defineField({
      name: 'applicationProcess',
      title: 'Hakuprosessi (Application process)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'therapyGoals',
      title: 'Terapian tavoitteet (Therapy goals)',
      type: 'text',
      rows: 6,
    }),
  ],
}),



    // ── RESEARCH SECTION ──────────────────────────
    defineField({
      name: 'research',
      title: 'Tutkimus -osio',
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

    // ── CONTACT ──────────────────────────
// ── CONTACT ──────────────────────────
defineField({
  name: 'contact',
  title: 'Yhteystiedot',
  type: 'object',
  fields: [
    defineField({
      name: 'email',
      title: 'Sähköposti',
      type: 'string',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      description: 'Full URL, e.g. https://instagram.com/sinivire',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'address',
      title: 'Katuosoite',
      type: 'string',
    }),
  ],
}),
  ],
})

export const schemaTypes = [page]
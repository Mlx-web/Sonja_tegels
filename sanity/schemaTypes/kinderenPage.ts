import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'kinderen-en-scholenPage',
  title: 'Voor kinderen & scholen',
  type: 'document',
  fields: [
    defineField({
      name: 'pijler',
      title: 'Titel (boven het plaatje)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sub',
      title: 'Ondertitel (onder het plaatje)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cards',
      title: 'Kaartjes',
      description: 'Voeg toe, verwijder of versleep om de volgorde te wijzigen.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'card',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'body',
              title: 'Tekst',
              description: 'Elke regel wordt een eigen alinea.',
              type: 'array',
              of: [{type: 'text', rows: 3}],
            }),
            defineField({name: 'linkText', title: 'Linktekst (optioneel)', type: 'string'}),
            defineField({name: 'linkUrl', title: 'Link-URL (optioneel)', type: 'url'}),
            defineField({
              name: 'binnenkort',
              title: 'Toon ook op de homepage onder "Binnenkort"',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Voor kinderen & scholen'}
    },
  },
})

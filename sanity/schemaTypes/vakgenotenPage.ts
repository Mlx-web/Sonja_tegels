import {defineField, defineType} from 'sanity'

const binnenkortField = defineField({
  name: 'binnenkort',
  title: 'Toon ook op de homepage onder "Binnenkort"',
  type: 'boolean',
  initialValue: false,
})

const cardField = defineField({
  name: 'extraCards',
  title: 'Extra kaartjes',
  description: 'Voeg toe, verwijder of versleep om de volgorde te wijzigen.',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'card',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'body', title: 'Tekst', type: 'array', of: [{type: 'text', rows: 3}]}),
        defineField({name: 'linkText', title: 'Linktekst (optioneel)', type: 'string'}),
        defineField({name: 'linkUrl', title: 'Link-URL (optioneel)', type: 'url'}),
        binnenkortField,
      ],
      preview: {select: {title: 'title'}},
    },
  ],
})

export default defineType({
  name: 'vakgenotenPage',
  title: 'Vakgenoten',
  type: 'document',
  fields: [
    defineField({name: 'pijler', title: 'Titel (boven het plaatje)', type: 'string'}),
    defineField({name: 'sub', title: 'Subtekst (onder het plaatje)', type: 'text', rows: 2}),
    defineField({
      name: 'workshops',
      title: 'Kaartje: Workshops voor vakgenoten',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'body', title: 'Tekst', type: 'text', rows: 4}),
        defineField({name: 'linkText', title: 'Linktekst', type: 'string'}),
        binnenkortField,
      ],
    }),
    defineField({
      name: 'eerdereWorkshops',
      title: 'Kaartje: Eerdere workshops',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Workshops',
          description: 'Voeg toe, verwijder of versleep om de volgorde te wijzigen.',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'item',
              fields: [
                defineField({name: 'label', title: 'Naam workshop', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'description', title: 'Omschrijving', type: 'text', rows: 2}),
              ],
              preview: {select: {title: 'label'}},
            },
          ],
        }),
      ],
    }),
    cardField,
  ],
  preview: {
    prepare() {
      return {title: 'Vakgenoten'}
    },
  },
})

import {defineField, defineType} from 'sanity'

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
      ],
      preview: {select: {title: 'title'}},
    },
  ],
})

export default defineType({
  name: 'organisaties-en-professionalsPage',
  title: 'Organisaties & Professionals',
  type: 'document',
  fields: [
    defineField({name: 'pijler', title: 'Titel (boven het plaatje)', type: 'string'}),
    defineField({name: 'lead', title: 'Introtekst (onder het plaatje)', type: 'text', rows: 3}),
    defineField({
      name: 'wur',
      title: 'Kaartje: Schrijfworkshops WUR',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'body', title: 'Tekst', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'huisarts',
      title: 'Kaartje: Schrijfworkshops huisartsopleiders',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'body', title: 'Tekst', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'beleidsromans',
      title: 'Kaartje: Beleidsromans',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 3}),
        defineField({name: 'booksIntro', title: 'Zin voor de boekenlijst', type: 'string'}),
        defineField({
          name: 'books',
          title: 'Boeken',
          description: 'Voeg toe, verwijder of versleep om de volgorde te wijzigen. Wordt automatisch samengevoegd tot een zin (X, Y en Z).',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'book',
              fields: [
                defineField({name: 'title', title: 'Titel', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'year', title: 'Jaar', type: 'string'}),
                defineField({name: 'description', title: 'Omschrijving', type: 'text', rows: 2}),
              ],
              preview: {select: {title: 'title', subtitle: 'year'}},
            },
          ],
        }),
        defineField({name: 'closing', title: 'Slotzin', type: 'text', rows: 2}),
      ],
    }),
    defineField({
      name: 'beleidsfeuilleton',
      title: 'Kaartje: Beleidsfeuilleton',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'body', title: 'Tekst', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'andereIdeeen',
      title: 'Kaartje: Andere ideeën?',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'body', title: 'Tekst', type: 'text', rows: 3}),
      ],
    }),
    cardField,
  ],
  preview: {
    prepare() {
      return {title: 'Organisaties & Professionals'}
    },
  },
})

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
  name: 'schrijven-voor-iedereenPage',
  title: 'Schrijven voor Iedereen',
  type: 'document',
  fields: [
    defineField({name: 'pijler', title: 'Titel (boven het plaatje)', type: 'string'}),
    defineField({name: 'subIntro', title: 'Introzin (onder het plaatje)', type: 'text', rows: 2}),
    defineField({name: 'subLocation', title: 'Locatiezin (onder het plaatje)', type: 'text', rows: 2}),
    defineField({name: 'quote', title: 'Quote (onder het plaatje, zonder aanhalingstekens)', type: 'text', rows: 2}),
    defineField({
      name: 'schrijfclub',
      title: 'Kaartje: Schrijfclub Wageningen',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 3}),
        defineField({name: 'agendaLead', title: 'Zin voor de agenda-link', type: 'string'}),
        defineField({name: 'agendaLinkText', title: 'Linktekst agenda', type: 'string'}),
        defineField({name: 'agendaUrl', title: 'Link-URL agenda', type: 'url'}),
        defineField({name: 'closing', title: 'Slotzin', type: 'text', rows: 2}),
      ],
    }),
    defineField({
      name: 'waga',
      title: 'Kaartje: Waga Write Club',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({
          name: 'lines',
          title: 'Tekstregels (cursief, Engels)',
          type: 'array',
          of: [{type: 'text', rows: 2}],
        }),
        defineField({name: 'ctaText', title: 'Knoptekst', type: 'string'}),
      ],
    }),
    defineField({
      name: 'writeHere',
      title: 'Kaartje: Write here! Write now!',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 3}),
        defineField({name: 'englishNote', title: 'Engelse toelichting (cursief)', type: 'text', rows: 2}),
        defineField({name: 'times', title: 'Tijden en locatie', type: 'text', rows: 2}),
      ],
    }),
    defineField({
      name: 'individueel',
      title: 'Kaartje: Individuele schrijfcoaching',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 3}),
        defineField({name: 'closing', title: 'Slotzin', type: 'text', rows: 2}),
      ],
    }),
    cardField,
  ],
  preview: {
    prepare() {
      return {title: 'Schrijven voor Iedereen'}
    },
  },
})

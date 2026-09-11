import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'over-mijPage',
  title: 'Over mij',
  type: 'document',
  fields: [
    defineField({name: 'pijler', title: 'Titel (in de hero)', type: 'string'}),
    defineField({name: 'subLine1', title: 'Subregel 1', type: 'string'}),
    defineField({name: 'subLine2', title: 'Subregel 2', type: 'string'}),
    defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 4}),
    defineField({name: 'publicatiesTitle', title: 'Kopje: Publicaties', type: 'string'}),
    defineField({
      name: 'publicaties',
      title: 'Publicaties',
      description: 'Voeg toe, verwijder of versleep om de volgorde te wijzigen. De titel wordt cursief getoond, gevolgd door de rest van de zin.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'publicatie',
          fields: [
            defineField({name: 'title', title: 'Titel (cursief)', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'rest',
              title: 'Rest van de zin',
              description: 'Bijvoorbeeld: " (Landwerk, 2013), een waterkwaliteitsroman." Let op de spatie aan het begin en de punt aan het eind.',
              type: 'string',
            }),
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    }),
    defineField({name: 'projectenTitle', title: 'Kopje: Eerdere projecten', type: 'string'}),
    defineField({
      name: 'projecten',
      title: 'Eerdere projecten',
      description: 'Voeg toe, verwijder of versleep om de volgorde te wijzigen.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'project',
          fields: [
            defineField({name: 'label', title: 'Naam project', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', title: 'Omschrijving', type: 'text', rows: 4}),
          ],
          preview: {select: {title: 'label'}},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Over mij'}
    },
  },
})

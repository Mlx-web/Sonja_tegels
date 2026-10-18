import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'schrijvenvooriedereenPage',
  title: 'Schrijven voor iedereen (korte overzichtspagina)',
  type: 'document',
  fields: [
    defineField({name: 'pijler', title: 'Titel (boven het plaatje)', type: 'string'}),
    defineField({name: 'sub', title: 'Subtekst (onder het plaatje)', type: 'text', rows: 2}),
    defineField({
      name: 'schrijfclub',
      title: 'Kaartje: Schrijfclub Wageningen',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 4}),
        defineField({name: 'linkText', title: 'Knoptekst', type: 'string'}),
        defineField({name: 'linkUrl', title: 'Link-URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'workshops',
      title: 'Kaartje: Workshops voor groepen',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 4}),
        defineField({name: 'linkText', title: 'Linktekst', type: 'string'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Schrijven voor iedereen (korte overzichtspagina)'}
    },
  },
})

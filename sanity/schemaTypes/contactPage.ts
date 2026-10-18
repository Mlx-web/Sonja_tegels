import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Aanmelden & Contact',
  type: 'document',
  fields: [
    defineField({name: 'pageTitle', title: 'Paginatitel', type: 'string'}),
    defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 3}),
    defineField({name: 'submitText', title: 'Tekst op de verstuurknop', type: 'string'}),
    defineField({
      name: 'werkplek',
      title: 'Werkplek-blok (adres onder het formulier)',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Titel', type: 'string'}),
        defineField({name: 'lines', title: 'Adresregels', type: 'array', of: [{type: 'string'}]}),
        defineField({name: 'linkText', title: 'Linktekst', type: 'string'}),
        defineField({name: 'linkUrl', title: 'Link-URL', type: 'url'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Aanmelden & Contact'}
    },
  },
})

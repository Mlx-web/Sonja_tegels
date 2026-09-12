import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Aanmelden & Contact',
  type: 'document',
  fields: [
    defineField({name: 'pageTitle', title: 'Paginatitel', type: 'string'}),
    defineField({name: 'intro', title: 'Introtekst', type: 'text', rows: 3}),
    defineField({name: 'submitText', title: 'Tekst op de verstuurknop', type: 'string'}),
  ],
  preview: {
    prepare() {
      return {title: 'Aanmelden & Contact'}
    },
  },
})

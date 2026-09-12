import {defineField, defineType} from 'sanity'

const tileField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({name: 'pijler', title: 'Titel op de tegel', type: 'string'}),
      defineField({name: 'sub', title: 'Subtekst op de tegel', type: 'string'}),
    ],
  })

export default defineType({
  name: 'indexPage',
  title: 'Homepage',
  type: 'document',
  fields: [
    tileField('tileSchrijven', 'Tegel: Schrijven voor Iedereen'),
    tileField('tileKinderen', 'Tegel: Voor kinderen & scholen'),
    tileField('tileOrganisaties', 'Tegel: Organisaties & Professionals'),
    tileField('tileVakgenoten', 'Tegel: Vakgenoten'),
    defineField({name: 'placeholderNote', title: 'Notitie onder de tegels', type: 'text', rows: 2}),
  ],
  preview: {
    prepare() {
      return {title: 'Homepage'}
    },
  },
})

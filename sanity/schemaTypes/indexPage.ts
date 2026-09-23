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

const DOELGROEP_OPTIONS = [
  {title: 'Schrijven voor Iedereen', value: 'schrijven-voor-iedereen'},
  {title: 'Voor kinderen & scholen', value: 'kinderen-en-scholen'},
  {title: 'Organisaties & Professionals', value: 'organisaties-en-professionals'},
  {title: 'Vakgenoten', value: 'vakgenoten'},
]

export default defineType({
  name: 'indexPage',
  title: 'Homepage',
  type: 'document',
  fields: [
    tileField('tileSchrijven', 'Tegel: Schrijven voor Iedereen'),
    tileField('tileKinderen', 'Tegel: Voor kinderen & scholen'),
    tileField('tileOrganisaties', 'Tegel: Organisaties & Professionals'),
    tileField('tileVakgenoten', 'Tegel: Vakgenoten'),
    defineField({
      name: 'binnenkort',
      title: 'Binnenkort',
      description:
        'Nieuwe activiteiten of aankondigingen. Kies bij elk kaartje de doelgroep: het krijgt dan automatisch de kleur van die doelgroep, en het kaartje verschijnt ook vanzelf op die doelgroep-pagina zelf — je hoeft het daar niet apart aan te maken.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'binnenkortItem',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'doelgroep',
              title: 'Doelgroep',
              type: 'string',
              options: {list: DOELGROEP_OPTIONS},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Tekst',
              description: 'Elke regel wordt een eigen alinea.',
              type: 'array',
              of: [{type: 'text', rows: 3}],
            }),
            defineField({
              name: 'linkText',
              title: 'Linktekst (optioneel)',
              description: 'Leeg laten voor "Meer info", met een link naar de doelgroep-pagina.',
              type: 'string',
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link-URL (optioneel)',
              description: 'Leeg laten om naar de doelgroep-pagina zelf te linken.',
              type: 'url',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'doelgroep'}},
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homepage'}
    },
  },
})

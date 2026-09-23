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
        'Nieuwe activiteiten of aankondigingen. Kies bij elk kaartje de doelgroep: het krijgt dan automatisch de kleur van die doelgroep, en het kaartje verschijnt ook vanzelf op die doelgroep-pagina zelf — je hoeft het daar niet apart aan te maken. Let op: op de homepage zelf toont het kaartje alleen de eerste zin van de tekst (met een "Meer info"-link naar de doelgroep-pagina); de volledige tekst die je hier typt verschijnt pas op die doelgroep-pagina.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'binnenkortItem',
          fields: [
            defineField({name: 'title', title: 'Titel', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'datum',
              title: 'Datum (optioneel)',
              description:
                'Bijvoorbeeld "10 oktober". Verschijnt naast "Binnenkort" op het kaartje, in dezelfde stijl. Leeg laten als er nog geen datum bekend is.',
              type: 'string',
            }),
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
              description:
                'Elke regel wordt een eigen alinea. Typ hier de volledige tekst — op de homepage verschijnt automatisch alleen de eerste zin, de volledige tekst zie je terug op de doelgroep-pagina.',
              type: 'array',
              of: [{type: 'text', rows: 3}],
            }),
            defineField({
              name: 'linkText',
              title: 'Linktekst op de doelgroep-pagina (optioneel)',
              description:
                'Voor het volledige kaartje op de doelgroep-pagina zelf. Leeg laten voor "Meer info". Op de homepage staat altijd gewoon "Meer info", met een link naar de doelgroep-pagina.',
              type: 'string',
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link-URL op de doelgroep-pagina (optioneel)',
              description:
                'Voor het volledige kaartje op de doelgroep-pagina zelf, bijvoorbeeld een extern aanmeldformulier. Leeg laten om naar niets te linken.',
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

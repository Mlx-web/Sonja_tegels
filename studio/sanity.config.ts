import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from '../sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Sonja van der Arend — website beheer',

  projectId: 'tdtq8qo7',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

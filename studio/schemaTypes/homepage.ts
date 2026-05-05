import { defineField, defineType } from 'sanity'

export const homepageSchema = defineType({
  name: 'homepage',
  title: 'Domovská stránka',
  type: 'document',
  fields: [
    defineField({ name: 'heroHeadline', title: 'Hero – nadpis (řádek 1)', type: 'string', description: 'Např. „Pozemek, nebo rovnou"' }),
    defineField({ name: 'heroHeadlineAccent', title: 'Hero – nadpis (řádek 2, oranžový)', type: 'string', description: 'Např. „pozemek s domem 5+kk?"' }),
    defineField({ name: 'heroSubheadline', title: 'Hero – podtitulek', type: 'text', rows: 2 }),
    defineField({ name: 'heroImage', title: 'Hero – pozadí', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'infoStats',
      title: 'Info lišta – statistiky',
      description: 'Doporučujeme 2 položky (např. „13 parcel" a „5+kk"). Zobrazují se v jednom řádku vedle CTA tlačítek.',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Popisek', type: 'string' },
          { name: 'value', title: 'Hodnota', type: 'string' },
        ],
      }],
    }),
    defineField({ name: 'aboutHeading', title: 'O projektu – nadpis', type: 'string' }),
    defineField({ name: 'aboutParagraph1', title: 'O projektu – odstavec 1', type: 'text', rows: 4 }),
    defineField({ name: 'aboutParagraph2', title: 'O projektu – odstavec 2', type: 'text', rows: 4 }),
    defineField({ name: 'aboutParagraph3', title: 'O projektu – odstavec 3', type: 'text', rows: 4 }),
    defineField({ name: 'aboutHighlightTitle', title: 'O projektu – box nadpis', type: 'string' }),
    defineField({
      name: 'aboutHighlightItems',
      title: 'O projektu – box položky',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string', title: 'Štítek' }, { name: 'value', type: 'string', title: 'Hodnota' }] }],
    }),
    defineField({
      name: 'roughBuildingText',
      title: 'O projektu – co je hrubá stavba (text pod boxem)',
      type: 'text',
      rows: 5,
      description: 'Vysvětlení pojmu „hrubá stavba" pro zájemce. Zobrazí se pod boxem Klíčové informace.',
    }),
    defineField({ name: 'aboutImage1', title: 'O projektu – foto 1', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'aboutImage2', title: 'O projektu – foto 2', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'techHeading', title: 'Detaily projektu – nadpis', type: 'string' }),
    defineField({
      name: 'techCards',
      title: 'Detaily projektu – karty',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', title: 'Ikona', type: 'string' },
          { name: 'title', title: 'Nadpis', type: 'string' },
          { name: 'text', title: 'Text', type: 'text', rows: 3 },
        ],
      }],
    }),
    defineField({ name: 'locationHeading', title: 'Lokalita – nadpis', type: 'string' }),
    defineField({ name: 'locationIntro', title: 'Lokalita – text', type: 'text', rows: 4 }),
    defineField({ name: 'locationNote', title: 'Lokalita – poznámka', type: 'text', rows: 2 }),
    defineField({
      name: 'locationDistances',
      title: 'Lokalita – vzdálenosti',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', title: 'Ikona', type: 'string' },
          { name: 'label', title: 'Popisek', type: 'string' },
          { name: 'dist', title: 'Vzdálenost', type: 'string' },
        ],
      }],
    }),
    defineField({ name: 'mapUrl', title: 'Mapa – URL iframe', type: 'url' }),
    defineField({ name: 'youtubeId', title: 'YouTube video ID', type: 'string' }),
  ],
  preview: {
    prepare() { return { title: 'Domovská stránka' } },
  },
})

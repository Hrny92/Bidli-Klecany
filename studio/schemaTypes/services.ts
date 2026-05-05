import { defineField, defineType } from 'sanity'

export const servicesSchema = defineType({
  name: 'services',
  title: 'Služby',
  type: 'document',
  fields: [
    defineField({ name: 'realEstateTitle', title: 'Prodej nemovitosti – nadpis', type: 'string' }),
    defineField({ name: 'realEstateText',  title: 'Prodej nemovitosti – text',   type: 'text', rows: 4 }),
    defineField({ name: 'financingTitle',  title: 'Financování – nadpis',        type: 'string' }),
    defineField({ name: 'financingText',   title: 'Financování – text',          type: 'text', rows: 4 }),
    defineField({ name: 'insuranceTitle',  title: 'Pojištění – nadpis',          type: 'string' }),
    defineField({ name: 'insuranceText',   title: 'Pojištění – text',            type: 'text', rows: 4 }),
    defineField({ name: 'energyTitle',     title: 'Energie – nadpis',            type: 'string' }),
    defineField({ name: 'energyText',      title: 'Energie – text',              type: 'text', rows: 4 }),
    defineField({ name: 'solarTitle',      title: 'Fotovoltaika – nadpis',       type: 'string' }),
    defineField({ name: 'solarText',       title: 'Fotovoltaika – text',         type: 'text', rows: 6 }),
  ],
  preview: {
    prepare() { return { title: 'Služby' } },
  },
})

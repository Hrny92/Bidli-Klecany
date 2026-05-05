import { defineField, defineType } from 'sanity'

const ACCEPT_FILES = 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const plotSchema = defineType({
  name: 'plot',
  title: 'Pozemky',
  type: 'document',
  fields: [
    // ── FIXNÍ – jen pro identifikaci ──────────────────────────────────────────
    defineField({
      name: 'number',
      title: 'Číslo pozemku',
      type: 'string',
      description: 'Číslo pozemku – propojení s mapou (např. 1, 2, 13). Neupravujte.',
      readOnly: true,
    }),

    // ── EDITOVATELNÁ ───────────────────────────────────────────────────────────
    defineField({
      name: 'hidden',
      title: 'Skrýt pozemek',
      type: 'boolean',
      description: 'Skrytý pozemek se nezobrazuje na webu.',
      initialValue: false,
    }),

    defineField({
      name: 'offerType',
      title: 'Typ nabídky',
      type: 'string',
      description: 'Co je v nabídce u tohoto pozemku?',
      options: {
        list: [
          { title: '📐 Jen pozemek',             value: 'pozemek' },
          { title: '🏠 Pozemek + dům 5+kk',      value: 'dum' },
          { title: '✨ Oboje – klient si vybere', value: 'oboje' },
        ],
        layout: 'radio',
      },
      initialValue: 'oboje',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'status',
      title: 'Stav pozemku',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Volný',     value: 'volný' },
          { title: '🟡 Rezervace', value: 'rezervováno' },
          { title: '🔴 Prodáno',   value: 'prodáno' },
        ],
        layout: 'radio',
      },
      initialValue: 'volný',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'plotSize',
      title: 'Plocha pozemku (m²)',
      type: 'string',
      description: 'Např. „620 m²"',
    }),

    defineField({
      name: 'floorArea',
      title: 'Plocha domu (m²)',
      type: 'string',
      description: 'Užitná plocha rodinného domu, např. „180 m²"',
    }),

    defineField({
      name: 'disposition',
      title: 'Dispozice domu',
      type: 'string',
      description: 'Např. „5+kk"',
      initialValue: '5+kk',
    }),

    // ── CENY ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Cena – jen pozemek',
      type: 'string',
      description: 'Cena samotného pozemku, např. „3 990 000 Kč"',
    }),

    defineField({
      name: 'priceWithHouse',
      title: 'Cena – pozemek + dům ve hrubé stavbě',
      type: 'string',
      description: 'Cena pozemku spolu s domem, např. „6 990 000 Kč"',
    }),

    // ── POPISY ────────────────────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Popis pozemku (jen pozemek)',
      type: 'text',
      rows: 4,
      description: 'Text zobrazený na kartě při nabídce samotného pozemku.',
    }),

    defineField({
      name: 'descriptionWithHouse',
      title: 'Popis pozemku + domu',
      type: 'text',
      rows: 4,
      description: 'Doplňující text při variantě pozemek + dům ve hrubé stavbě.',
    }),

    // ── FOTOGRAFIE A SOUBORY ──────────────────────────────────────────────────
    defineField({
      name: 'photos',
      title: 'Fotografie / vizualizace',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Fotky nebo vizualizace pozemku/domu.',
    }),

    defineField({
      name: 'floorPlans',
      title: 'Půdorysy',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'file', title: 'Soubor', type: 'file', options: { accept: ACCEPT_FILES } },
          { name: 'title', title: 'Název souboru (volitelný)', type: 'string' },
        ],
        preview: {
          select: { title: 'title' },
          prepare({ title }: { title?: string }) {
            return { title: `📐 ${title ?? 'Půdorys'}` }
          },
        },
      }],
    }),

    defineField({
      name: 'catalogSheets',
      title: 'Katalogové listy',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'file', title: 'Soubor', type: 'file', options: { accept: ACCEPT_FILES } },
          { name: 'title', title: 'Název souboru (volitelný)', type: 'string' },
        ],
        preview: {
          select: { title: 'title' },
          prepare({ title }: { title?: string }) {
            return { title: `📋 ${title ?? 'Katalogový list'}` }
          },
        },
      }],
    }),
  ],
  preview: {
    select: { num: 'number', id: '_id', subtitle: 'status', offerType: 'offerType' },
    prepare({ num, id, subtitle, offerType }: { num?: string; id?: string; subtitle?: string; offerType?: string }) {
      const n = num ?? id?.replace(/^plot-/, '') ?? '?'
      const emoji = subtitle === 'volný' ? '🟢' : subtitle === 'rezervováno' ? '🟡' : '🔴'
      const offerEmoji = offerType === 'pozemek' ? '📐' : offerType === 'dum' ? '🏠' : '✨'
      return { title: `${offerEmoji} Pozemek ${n}`, subtitle: `${emoji} ${subtitle ?? '–'}` }
    },
  },
})

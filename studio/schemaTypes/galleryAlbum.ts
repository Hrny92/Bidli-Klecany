import { defineField, defineType } from 'sanity'

export const galleryAlbumSchema = defineType({
  name: 'galleryAlbum',
  title: 'Galerie – alba',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Název alba',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (identifikátor)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Používané hodnoty: exteriery, interiery, pudorysy, dron',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Pořadí',
      type: 'number',
      description: 'Nižší číslo = zobrazí se dříve',
      initialValue: 10,
    }),
    defineField({
      name: 'images',
      title: 'Fotografie',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', title: 'Popisek (alt)', type: 'string' },
          { name: 'caption', title: 'Titulek', type: 'string' },
        ],
      }],
    }),
  ],
  preview: {
    select: { title: 'title', order: 'order', media: 'images.0' },
    prepare({ title, order, media }: { title?: string; order?: number; media?: unknown }) {
      return { title: `${order ?? '–'}. ${title ?? 'Album'}`, media }
    },
  },
})

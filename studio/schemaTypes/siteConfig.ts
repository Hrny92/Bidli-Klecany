import { defineField, defineType } from 'sanity'

export const siteConfigSchema = defineType({
  name: 'siteConfig',
  title: 'Nastavení webu',
  type: 'document',
  fields: [
    defineField({ name: 'agentName',  title: 'Jméno makléře / týmu', type: 'string' }),
    defineField({ name: 'agentPhone', title: 'Telefon', type: 'string' }),
    defineField({ name: 'agentEmail', title: 'E-mail', type: 'string' }),
    defineField({ name: 'agentPhoto', title: 'Foto makléře', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'agentQuote', title: 'Citát v patičce', type: 'text', rows: 2 }),
    defineField({ name: 'agentBio',   title: 'Bio text v patičce', type: 'text', rows: 3 }),
  ],
  preview: {
    prepare() { return { title: 'Nastavení webu' } },
  },
})

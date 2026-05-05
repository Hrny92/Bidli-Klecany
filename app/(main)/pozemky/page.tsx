import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import PozemkyClient, { type SanityPlot } from './PozemkyClient'
import { buildMetadata } from '@/lib/seo'
import type { SanityGalleryAlbum } from '@/components/GallerySection'

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Nabídka pozemků a domů – Klecany, 5 km od Prahy',
  description: '13 pozemků s vydaným stavebním povolením v Klecanech. Vyberte si: jen pozemek nebo pozemek s domem 5+kk ve hrubé stavbě k dokončení.',
  path: '/pozemky',
})

// ─── Záložní data ──────────────────────────────────────────────────────────────

const FALLBACK_PLOTS: SanityPlot[] = [
  { _id: 'p01', number: '1',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p02', number: '2',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p03', number: '3',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p04', number: '4',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p05', number: '5',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p06', number: '6',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p07', number: '7',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p08', number: '8',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p09', number: '9',  plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p10', number: '10', plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p11', number: '11', plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p12', number: '12', plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
  { _id: 'p13', number: '13', plotSize: 'info u makléře', price: 'Info u makléře', status: 'volný', offerType: 'oboje' },
]

const GALLERY_ALBUMS_QUERY = `*[_type == "galleryAlbum"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  order,
  images[] {
    "url": asset->url,
    alt,
    caption
  }
}`

const PLOTS_QUERY = `*[_type == "plot"] | order(number asc) {
  _id,
  number,
  status,
  hidden,
  offerType,
  plotSize,
  floorArea,
  disposition,
  price,
  priceWithHouse,
  description,
  descriptionWithHouse,
  "photos": photos[].asset->url,
  floorPlans[] {
    "url": file.asset->url,
    "mimeType": file.asset->mimeType,
    "originalFilename": file.asset->originalFilename,
    title
  },
  catalogSheets[] {
    "url": file.asset->url,
    "mimeType": file.asset->mimeType,
    "originalFilename": file.asset->originalFilename,
    title
  }
}`

export default async function PozemkyPage() {
  let plots: SanityPlot[] = []
  let galleryImages: string[] = []
  let albums: SanityGalleryAlbum[] = []

  try {
    const [plotData, albumData] = await Promise.all([
      sanityClient.fetch<SanityPlot[]>(PLOTS_QUERY),
      sanityClient.fetch<SanityGalleryAlbum[]>(GALLERY_ALBUMS_QUERY),
    ])

    plots = plotData?.length
      ? plotData.sort((a, b) => Number(a.number) - Number(b.number))
      : FALLBACK_PLOTS

    albums = albumData ?? []

    galleryImages = albums
      .filter((a) => ['exteriery', 'interiery'].includes(a.slug))
      .flatMap((a) => a.images?.map((img) => img.url).filter(Boolean) ?? [])
  } catch {
    plots = FALLBACK_PLOTS
  }

  return <PozemkyClient plots={plots} galleryImages={galleryImages} albums={albums} />
}

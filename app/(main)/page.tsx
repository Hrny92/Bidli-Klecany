import type { Metadata } from 'next'
import Image from 'next/image'
import GallerySection, { type SanityGalleryAlbum } from '@/components/GallerySection'
import { sanityClient } from '@/sanity/client'
import { SiteIcon } from '@/lib/icons'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import TransitionLink from '@/components/TransitionLink'
import SEO from '@/components/SEO'
import { buildMetadata, schemaPozemky } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Bidli v Klecanech – pozemky a rodinné domy 5+kk, 5 km od Prahy',
  description: 'Exkluzivní pozemky s vydaným stavebním povolením v Klecanech 5 km od Prahy. Vyberte si: jen pozemek nebo pozemek s rodinným domem 5+kk ve hrubé stavbě.',
  path: '',
})

// ─── Typy ─────────────────────────────────────────────────────────────────────

interface SanityHomepage {
  heroHeadline?: string
  heroHeadlineAccent?: string
  heroSubheadline?: string
  heroImageUrl?: string
  infoStats?: { label: string; value: string }[]
  aboutHeading?: string
  aboutParagraph1?: string
  aboutParagraph2?: string
  aboutParagraph3?: string
  aboutHighlightTitle?: string
  aboutHighlightItems?: { label: string; value: string }[]
  roughBuildingText?: string
  aboutImage1Url?: string
  aboutImage2Url?: string
  techHeading?: string
  techCards?: { icon?: string; title: string; text: string }[]
  locationHeading?: string
  locationIntro?: string
  locationNote?: string
  locationDistances?: { icon?: string; label: string; dist: string }[]
  mapUrl?: string
  youtubeId?: string
}

// ─── GROQ dotazy ──────────────────────────────────────────────────────────────

const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  heroHeadline,
  heroHeadlineAccent,
  heroSubheadline,
  "heroImageUrl": heroImage.asset->url,
  infoStats,
  aboutHeading,
  aboutParagraph1,
  aboutParagraph2,
  aboutParagraph3,
  aboutHighlightTitle,
  aboutHighlightItems,
  roughBuildingText,
  "aboutImage1Url": aboutImage1.asset->url,
  "aboutImage2Url": aboutImage2.asset->url,
  techHeading,
  techCards,
  locationHeading,
  locationIntro,
  locationNote,
  locationDistances,
  mapUrl,
  youtubeId
}`

const GALLERY_QUERY = `*[_type == "galleryAlbum"] | order(order asc) {
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

// ─── Záložní data ──────────────────────────────────────────────────────────────

const FALLBACK_INFO_STATS = [
  { label: 'Pozemků celkem', value: '13 parcel', colored: false },
  { label: 'Dispozice', value: '5+kk', colored: false },
]

const FALLBACK_DISTANCES = [
  { icon: 'school',    label: 'Škola a školka',     dist: '500 m' },
  { icon: 'sport',     label: 'Sport a volný čas',   dist: '700 m' },
  { icon: 'bus',       label: 'MHD – autobus',        dist: '500 m' },
  { icon: 'shopping',  label: 'Potraviny',             dist: '600 m' },
]

const FALLBACK_TECH_CARDS = [
  {
    icon: 'document',
    title: 'Stavební povolení vydáno',
    text: 'Všechny pozemky mají platné stavební povolení na rodinné domy 5+kk o velkorysé dispozici. Žádné čekání, žádná byrokracie – stavba může začít.',
  },
  {
    icon: 'plan',
    title: 'Jen pozemek',
    text: 'Kupte si pozemek a postavte dům přesně podle svých představ. Stavební povolení máte v kapse, projekt volte svobodně dle vlastního vkusu.',
  },
  {
    icon: 'bolt',
    title: 'Pozemek + dům ve hrubé stavbě',
    text: 'Chcete mít náskok? Pořiďte si pozemek spolu s rodinným domem 5+kk ve hrubé stavbě. Dokončete interiéry přesně podle sebe a nastěhujte se dříve.',
  },
]

// ─── Stránka ───────────────────────────────────────────────────────────────────

export default async function HomePage() {
  let hp: SanityHomepage = {}
  let galleries: SanityGalleryAlbum[] = []

  try {
    const [hpData, galData] = await Promise.all([
      sanityClient.fetch<SanityHomepage>(HOMEPAGE_QUERY),
      sanityClient.fetch<SanityGalleryAlbum[]>(GALLERY_QUERY),
    ])
    hp = hpData ?? {}
    galleries = galData ?? []
  } catch {
    // Sanity nedostupná → záložní hodnoty
  }

  const infoStats = hp.infoStats?.length ? hp.infoStats : FALLBACK_INFO_STATS
  const distances = hp.locationDistances?.length ? hp.locationDistances : FALLBACK_DISTANCES
  const techCards = hp.techCards?.length ? hp.techCards : FALLBACK_TECH_CARDS

  return (
    <>
      <SEO schemas={[schemaPozemky]} />

      {/* HERO */}
      <section className="relative p-2 h-2/4">
        <div
          className="relative flex flex-col justify-end h-full rounded-[3rem] overflow-hidden bg-gray-900"
          style={{ minHeight: '75vh' }}
        >
          {/* Placeholder – růžová plocha dokud nejsou fotky */}
          {hp.heroImageUrl ? (
            <Image
              src={hp.heroImageUrl}
              alt="Vizualizace rodinných domů Klecany"
              fill
              className="object-cover pointer-events-none"
              sizes="100vw"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-pink-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/100 via-gray-900/80 to-transparent" />
          <div className="relative z-10 container mx-auto px-6 pb-14 md:pb-32 pt-32">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {hp.heroHeadline ?? 'Pozemek, nebo rovnou'} <br />
                <span className="text-white md:text-accent">
                  {hp.heroHeadlineAccent ?? 'pozemek s domem 5+kk?'}
                </span>
              </h1>
              <p className="text-lg md:text-xl font-light mb-8 opacity-90 max-w-2xl">
                {hp.heroSubheadline ??
                  'Volba je jen na vás. 13 exkluzivních pozemků s vydaným stavebním povolením v Klecanech – pouhých 5 km od Prahy. Kupte jen pozemek nebo si rovnou pořiďte rodinný dům 5+kk ve hrubé stavbě.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DUÁLNÍ VOLBA – klíčový feature */}
      <section className="container mx-auto px-6 relative z-20 -mt-10 md:-mt-20 mb-12">
        <AnimateOnScroll animation="up">
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-[100px] opacity-10 pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Statistiky */}
              <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 shrink-0">
                {infoStats.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-8 md:gap-12">
                    {i > 0 && <div className="hidden sm:block w-px h-12 bg-gray-200" />}
                    <div className="text-center sm:text-left">
                      <p className="text-gray-500 text-sm uppercase tracking-widest mb-1 font-bold">
                        {item.label}
                      </p>
                      <div className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Duální CTA tlačítka */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
                <TransitionLink
                  href="/pozemky?typ=pozemek"
                  className="flex items-center justify-center bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3.5 rounded-full font-bold text-base transition-all duration-300 group whitespace-nowrap"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Chci jen pozemek
                </TransitionLink>
                <TransitionLink
                  href="/pozemky?typ=dum"
                  className="flex items-center justify-center bg-accent hover:bg-black text-white px-6 py-3.5 rounded-full font-bold text-base transition-all duration-300 shadow-[0_0_20px_rgba(239,134,37,0.3)] hover:shadow-none group whitespace-nowrap"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Chci pozemek + dům
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </TransitionLink>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* O PROJEKTU */}
      <section id="O-projektu" className="py-20 md:py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AnimateOnScroll animation="left">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
                {hp.aboutHeading ?? 'Bidli v Klecanech'}
              </h2>
              <div className="text-lg font-light text-gray-600 space-y-6">
                {hp.aboutParagraph1 ? (
                  <p className="hyphens-auto">{hp.aboutParagraph1}</p>
                ) : (
                  <p className="hyphens-auto">
                    Exkluzivní rodinné domy v atraktivní lokalitě ve městě Klecany{' '}
                    <strong>pouhých 5 km od Prahy</strong>. Celé dokončení exteriérů (ploty, zpevněné plochy),
                    interiérů a jejich povrchových úprav realizuje kupující po vlastní ose dle svého vkusu.
                  </p>
                )}
                {hp.aboutParagraph2 ? (
                  <p className="hyphens-auto">{hp.aboutParagraph2}</p>
                ) : (
                  <p className="hyphens-auto">
                    Nabízíme dvě možnosti: <strong>jen pozemek</strong> s vydaným stavebním povolením –
                    dům si navrhnete a postavíte přesně podle svých představ. Nebo si rovnou pořídíte{' '}
                    <strong>pozemek spolu s domem 5+kk ve hrubé stavbě</strong> a dokončíte interiéry
                    dle vlastního vkusu.
                  </p>
                )}
                {hp.aboutParagraph3 ? (
                  <p className="hyphens-auto">{hp.aboutParagraph3}</p>
                ) : (
                  <p className="hyphens-auto">
                    V nabídce je celkem <strong>13 pozemků</strong> v klidném a zeleném prostředí
                    Klecan. Autem jste na okraji Prahy za 8 minut, MHD je 500 metrů od vašeho nového domova.
                  </p>
                )}

                {hp.aboutHighlightItems?.length ? (
                  <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 mt-6">
                    {hp.aboutHighlightTitle && (
                      <h3 className="font-bold text-accent mb-2">{hp.aboutHighlightTitle}</h3>
                    )}
                    <ul className="text-sm text-gray-700 space-y-2">
                      {hp.aboutHighlightItems.map((item) => (
                        <li key={item.label}>
                          <strong>{item.label}:</strong> {item.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 mt-6">
                    <h3 className="font-bold text-accent mb-2">Klíčové informace</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li><strong>Lokalita:</strong> Klecany, Praha-východ – 5 km od Prahy</li>
                      <li><strong>Počet parcel:</strong> 13 pozemků</li>
                      <li><strong>Dispozice domů:</strong> 5+kk (velkorysá)</li>
                      <li><strong>Stavební povolení:</strong> vydáno</li>
                      <li><strong>Volba:</strong> jen pozemek nebo pozemek + dům ve hrubé stavbě</li>
                    </ul>
                  </div>
                )}

                {/* Co je hrubá stavba */}
                <div className="p-6 rounded-2xl bg-gray-100 border border-gray-200 mt-6">
                  <h3 className="font-bold text-gray-900 mb-2">Co je hrubá stavba?</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed hyphens-auto">
                    {hp.roughBuildingText ??
                      'Hrubá stavba zahrnuje základy, nosné zdivo, stropy, střechu a vnější obvodové konstrukce – dům je uzavřen vůči počasí, ale bez dokončených interiérů. Kupující sám zvolí podlahy, obklady, kuchyni i koupelnu přesně podle svého vkusu a provede dokončovací práce vlastním tempem.'}
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Obrázky */}
          <AnimateOnScroll animation="right" delay={150}>
            <div className="flex flex-col gap-8 w-full h-full justify-center mt-8 lg:mt-0">
              <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-xl relative bg-pink-500">
                {hp.aboutImage1Url && (
                  <Image
                    src={hp.aboutImage1Url}
                    alt="Vizualizace exteriéru – Klecany"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                )}
                {!hp.aboutImage1Url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest select-none">Vizualizace exteriéru</span>
                  </div>
                )}
              </div>
              <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-xl relative bg-pink-500">
                {hp.aboutImage2Url && (
                  <Image
                    src={hp.aboutImage2Url}
                    alt="Vizualizace interiéru – Klecany"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                )}
                {!hp.aboutImage2Url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest select-none">Vizualizace interiéru</span>
                  </div>
                )}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* TECHNICKÉ DETAILY – 3 karty (stavební povolení, jen pozemek, pozemek+dům) */}
      <section id="Technicke-udaje" className="py-32 relative overflow-hidden rounded-[3rem] mx-2 md:mx-6 bg-primary">
        <div className="container mx-auto px-6 relative z-10">
          <AnimateOnScroll animation="up">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white text-center">
              {hp.techHeading ?? 'Vaše výhody v Klecanech'}
            </h2>
          </AnimateOnScroll>
          <div className={
            techCards.length === 1
              ? 'max-w-sm mx-auto'
              : techCards.length === 2
                ? 'grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-6'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }>
            {techCards.map((card, i) => (
              <AnimateOnScroll key={card.title} animation="scale" delay={i * 120}>
                <div className="bg-white/40 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all text-white h-full">
                  <div className="mb-4">
                    <SiteIcon id={card.icon} className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="font-light text-sm">{card.text}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* LOKALITA */}
      <section id="Lokalita" className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimateOnScroll animation="left">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                {hp.locationHeading ?? 'Proč bydlet v Klecanech?'}
              </h2>
              <p className="text-gray-600 font-light text-lg mb-8 leading-relaxed hyphens-auto">
                {hp.locationIntro ??
                  'Klecany jsou velmi krásné město v okrese Praha-východ. Nabízí základní i mateřskou školu, základní uměleckou školu a knihovnu. Dopravní spojení do Prahy zajišťují autobusové linky, autem jste na okraji Prahy za 8 minut, a mezi břehy Vltavy funguje historický přívoz. Cyklisté mohou využít novou cyklostezku vedoucí do Prahy.'}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-8">
                {distances.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <SiteIcon id={item.icon} className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <strong className="block text-gray-900">{item.label}</strong>
                      <span className="text-sm text-gray-500">{item.dist}</span>
                    </div>
                  </div>
                ))}
              </div>
              {hp.locationNote ? (
                <p className="text-sm text-gray-500 hyphens-auto mt-4">{hp.locationNote}</p>
              ) : (
                <p className="text-sm text-gray-500 hyphens-auto mt-4">
                  Klecany nabízí kompletní občanskou vybavenost – školy, školku, lékaře, restaurace a úřad, vše v docházkové vzdálenosti. Praha je na dosah ruky.
                </p>
              )}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animation="right" delay={150} className="relative h-[400px] lg:h-auto">
            <div className="h-full rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-200">
              <iframe
                style={{ border: 'none' }}
                src={hp.mapUrl ?? 'https://mapy.com/s/klecany-u-prahy'}
                width="100%"
                height="100%"
                title="Mapa lokality Klecany"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* GALERIE + VIDEO */}
      <AnimateOnScroll animation="up">
        <GallerySection
          groups={['exteriery', 'interiery']}
          albums={galleries}
          youtubeId={hp.youtubeId ?? ''}
          title="Prozkoumejte projekt"
        />
      </AnimateOnScroll>
    </>
  )
}

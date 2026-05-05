/**
 * SEED SKRIPT – kompletní inicializace Klecany v Sanity
 *
 * Co dělá:
 *  1. Vytvoří nebo přepíše 13 pozemků (plot-1 až plot-13)
 *  2. Vytvoří nebo přepíše dokument homepage (texty a statistiky)
 *  3. Vytvoří nebo přepíše dokument siteConfig (makléř)
 *  4. Vytvoří nebo přepíše dokument services (5 služeb)
 *  5. Vytvoří gallery alba (pokud neexistují)
 *
 * Spuštění (ze složky Klecany/studio/):
 *   npx sanity exec scripts/seed.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ useCdn: false })

// ─── DATA: 13 POZEMKŮ ─────────────────────────────────────────────────────────

const POZEMKY = [
  { number: '1',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '2',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '3',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '4',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '5',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '6',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '7',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '8',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '9',  plotSize: 'Info u makléře', status: 'volný' },
  { number: '10', plotSize: 'Info u makléře', status: 'volný' },
  { number: '11', plotSize: 'Info u makléře', status: 'volný' },
  { number: '12', plotSize: 'Info u makléře', status: 'volný' },
  { number: '13', plotSize: 'Info u makléře', status: 'volný' },
] as const

// ─── DATA: GALERIE ────────────────────────────────────────────────────────────

const ALBUMS = [
  { _id: 'gallery-exteriery', title: 'Exteriéry', slug: 'exteriery', order: 1 },
  { _id: 'gallery-interiery', title: 'Interiéry', slug: 'interiery', order: 2 },
  { _id: 'gallery-pudorysy',  title: 'Půdorysy',  slug: 'pudorysy',  order: 3 },
  { _id: 'gallery-pozemky',   title: 'Pozemky',   slug: 'pozemky',   order: 4 },
]

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('  SEED – Bidli v Klecanech')
  console.log('═══════════════════════════════════════════════════════\n')

  // ── 1. POZEMKY ──────────────────────────────────────────────────────────────
  console.log('── POZEMKY (1–13) ─────────────────────────────────────')
  for (const p of POZEMKY) {
    await client.createOrReplace({
      _id: `plot-${p.number}`,
      _type: 'plot',
      number: p.number,
      offerType: 'oboje',
      disposition: '5+kk',
      floorArea: 'Info u makléře',
      plotSize: p.plotSize,
      price: 'Info u makléře',
      priceWithHouse: 'Info u makléře',
      status: p.status,
      hidden: false,
    })
    console.log(`  ✓  Pozemek ${p.number}`)
  }

  // ── 2. HOMEPAGE ─────────────────────────────────────────────────────────────
  console.log('\n── HOMEPAGE ───────────────────────────────────────────')
  await client.createOrReplace({
    _id: 'homepage',
    _type: 'homepage',
    heroHeadline: 'Pozemek, nebo rovnou',
    heroHeadlineAccent: 'pozemek s domem 5+kk?',
    heroSubheadline: 'Volba je jen na vás. 13 exkluzivních pozemků s vydaným stavebním povolením v Klecanech – pouhých 5 km od Prahy. Kupte jen pozemek nebo si rovnou pořiďte rodinný dům 5+kk ve hrubé stavbě.',
    infoStats: [
      { _key: 'stat1', label: 'Pozemků celkem', value: '13 parcel' },
      { _key: 'stat2', label: 'Dispozice', value: '5+kk' },
    ],
    aboutHeading: 'Bidli v Klecanech',
    aboutParagraph1: 'Exkluzivní rodinné domy v atraktivní lokalitě ve městě Klecany pouhých 5 km od Prahy. Celé dokončení exteriérů (ploty, zpevněné plochy), interiérů a jejich povrchových úprav realizuje kupující po vlastní ose dle svého vkusu.',
    aboutParagraph2: 'Nabízíme dvě možnosti: jen pozemek s vydaným stavebním povolením – dům si navrhnete a postavíte přesně podle svých představ. Nebo si rovnou pořídíte pozemek spolu s domem 5+kk ve hrubé stavbě a dokončíte interiéry dle vlastního vkusu.',
    aboutParagraph3: 'V nabídce je celkem 13 pozemků v klidném a zeleném prostředí Klecan. Autem jste na okraji Prahy za 8 minut, MHD je 500 metrů od vašeho nového domova.',
    aboutHighlightTitle: 'Klíčové informace',
    aboutHighlightItems: [
      { _key: 'hi1', label: 'Lokalita', value: 'Klecany, Praha-východ – 5 km od Prahy' },
      { _key: 'hi2', label: 'Počet parcel', value: '13 pozemků' },
      { _key: 'hi3', label: 'Dispozice domů', value: '5+kk (velkorysá)' },
      { _key: 'hi4', label: 'Stavební povolení', value: 'vydáno' },
      { _key: 'hi5', label: 'Volba', value: 'jen pozemek nebo pozemek + dům ve hrubé stavbě' },
    ],
    roughBuildingText: 'Co je hrubá stavba? Hrubá stavba zahrnuje základy, nosné zdivo, stropy, střechu a vnější obvodové konstrukce – dům je uzavřen vůči počasí, ale bez dokončených interiérů. Kupující sám zvolí podlahy, obklady, kuchyni i koupelnu přesně podle svého vkusu a provede dokončovací práce vlastním tempem.',
    techHeading: 'Vaše výhody v Klecanech',
    techCards: [
      {
        _key: 'tc1',
        icon: 'document',
        title: 'Stavební povolení vydáno',
        text: 'Všechny pozemky mají platné stavební povolení na rodinné domy 5+kk o velkorysé dispozici. Žádné čekání, žádná byrokracie – stavba může začít.',
      },
      {
        _key: 'tc2',
        icon: 'plan',
        title: 'Jen pozemek',
        text: 'Kupte si pozemek a postavte dům přesně podle svých představ. Stavební povolení máte v kapse, projekt volte svobodně dle vlastního vkusu.',
      },
      {
        _key: 'tc3',
        icon: 'bolt',
        title: 'Pozemek + dům ve hrubé stavbě',
        text: 'Chcete mít náskok? Pořiďte si pozemek spolu s rodinným domem 5+kk ve hrubé stavbě. Dokončete interiéry přesně podle sebe a nastěhujte se dříve.',
      },
    ],
    locationHeading: 'Proč bydlet v Klecanech?',
    locationIntro: 'Klecany jsou velmi krásné město v okrese Praha-východ. Nabízí základní i mateřskou školu, základní uměleckou školu a knihovnu. Dopravní spojení do Prahy zajišťují autobusové linky, autem jste na okraji Prahy za 8 minut, a mezi břehy Vltavy funguje historický přívoz. Cyklisté mohou využít novou cyklostezku vedoucí do Prahy.',
    locationNote: 'Klecany nabízí kompletní občanskou vybavenost – školy, školku, lékaře, restaurace a úřad, vše v docházkové vzdálenosti. Praha je na dosah ruky.',
    locationDistances: [
      { _key: 'ld1', icon: 'school',   label: 'Škola a školka',   dist: '500 m' },
      { _key: 'ld2', icon: 'sport',    label: 'Sport a volný čas', dist: '700 m' },
      { _key: 'ld3', icon: 'bus',      label: 'MHD – autobus',     dist: '500 m' },
      { _key: 'ld4', icon: 'shopping', label: 'Potraviny',         dist: '600 m' },
    ],
    mapUrl: 'https://mapy.com/s/klecany-u-prahy',
  })
  console.log('  ✓  Homepage')

  // ── 3. SITE CONFIG ──────────────────────────────────────────────────────────
  console.log('\n── SITE CONFIG ────────────────────────────────────────')
  await client.createOrReplace({
    _id: 'siteConfig',
    _type: 'siteConfig',
    agentName: 'Bidli Klecany',
    agentPhone: '+420 774 110 007',
    agentEmail: 'info@bidli.cz',
    agentQuote: 'Ráda se s vámi potkám přímo na místě, nebo vám zašlu doplňující informace a plány. Napište mi.',
    agentBio: 'Realitní specialista sítě BIDLI. Rádi vás provedeme nabídkou pozemků a domů v Klecanech a pomůžeme zajistit hladký průběh koupě.',
  })
  console.log('  ✓  SiteConfig')

  // ── 4. SERVICES ─────────────────────────────────────────────────────────────
  console.log('\n── SERVICES ───────────────────────────────────────────')
  await client.createOrReplace({
    _id: 'services',
    _type: 'services',
    realEstateTitle: 'Prodej stávající nemovitosti',
    realEstateText: 'Kompletně zajistíme prodej či pronájem vaší nemovitosti s využitím nejmodernějších technologií a nejširší inzerce. Díky našemu celorepublikovému pokrytí garantujeme rychlý a výhodný prodej.',
    financingTitle: 'Financování',
    financingText: 'Zajistíme pro vás nejvýhodnější financování nového domova napříč všemi bankami na trhu. Vyjednáme nejlepší úrokové sazby a postaráme se o veškerou administrativu.',
    insuranceTitle: 'Pojištění',
    insuranceText: 'Ochráníme váš nový domov i vás. Pomůžeme vám zorientovat se v nabídkách a sjednáme nejvýhodnější majetkové i životní pojištění.',
    energyTitle: 'Energie (plyn a elektřina)',
    energyText: 'Zajistíme výhodný tarif elektřiny a plynu na míru přímo pro vaši novou domácnost, včetně kompletního přehlášení a administrativy.',
    solarTitle: 'Fotovoltaika a tepelná čerpadla',
    solarText: 'Myslete na budoucnost a snižte provozní náklady svého nového domu. Náš tým specialistů navrhne optimální energetické řešení – fotovoltaiku s bateriovým úložištěm nebo tepelné čerpadlo. Zajistíme návrh, realizaci i státní dotace.',
  })
  console.log('  ✓  Services')

  // ── 5. GALERIE ───────────────────────────────────────────────────────────────
  console.log('\n── GALERIE ────────────────────────────────────────────')
  for (const album of ALBUMS) {
    await client.createIfNotExists({
      _id: album._id,
      _type: 'galleryAlbum',
      title: album.title,
      slug: { _type: 'slug', current: album.slug },
      order: album.order,
      images: [],
    })
    console.log(`  ✓  ${album._id}  (${album.slug})`)
  }

  // ── HOTOVO ───────────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  ✓ HOTOVO!')
  console.log('───────────────────────────────────────────────────────')
  console.log('  Pozemky:  13 (plot-1 až plot-13), offerType: oboje')
  console.log('  Homepage: hero, o projektu, výhody, lokalita')
  console.log('  Config:   Bidli Klecany, info@bidli.cz')
  console.log('  Services: 5 služeb')
  console.log('  Galerie:  exteriery, interiery, pudorysy, pozemky')
  console.log('───────────────────────────────────────────────────────')
  console.log('  Uprav plochy, ceny a fotky v Sanity Studiu.')
  console.log('═══════════════════════════════════════════════════════')
}

seed().catch((err) => {
  console.error('\n✗ Chyba:', err.message)
  process.exit(1)
})

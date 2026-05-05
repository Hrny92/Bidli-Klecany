import type { Metadata } from 'next'

// ─── Konfigurace webu ──────────────────────────────────────────────────────────

export const SITE = {
  name: 'Bidli v Klecanech',
  url: 'https://www.bidlivklecanech.cz',
  ogImage: 'https://www.bidlivklecanech.cz/img/og-image.webp',
  description:
    'Exkluzivní pozemky s vydaným stavebním povolením v Klecanech 5 km od Prahy. Vyberte si: jen pozemek nebo pozemek s rodinným domem 5+kk ve hrubé stavbě.',
  agent: {
    name: 'Bidli Klecany',
    phone: '+420774110007',
    phoneFormatted: '+420 774 110 007',
    email: 'info@bidli.cz',
    brand: 'BIDLI',
    brandUrl: 'https://www.bidli.cz',
  },
  address: {
    locality: 'Klecany',
    region: 'Praha-východ',
    postalCode: '250 67',
    country: 'CZ',
    countryName: 'Česká republika',
  },
  social: {
    facebook: 'https://www.facebook.com/bidlicz',
    instagram: 'https://www.instagram.com/bidlicz',
    linkedin: 'https://www.linkedin.com/company/18437972/',
    youtube: 'https://www.youtube.com/@BIDLIsevšímvšudy',
  },
} as const

// ─── Metadata builder ──────────────────────────────────────────────────────────

interface BuildMetadataOptions {
  title: string
  description?: string
  path?: string
  ogImage?: string
  noindex?: boolean
}

export function buildMetadata({
  title,
  description = SITE.description,
  path = '',
  ogImage = SITE.ogImage,
  noindex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE.url}${path}`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type: 'website',
      url,
      siteName: SITE.name,
      title,
      description,
      locale: 'cs_CZ',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ─── JSON-LD schémata ──────────────────────────────────────────────────────────

/** WebSite schema */
export const schemaWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'cs',
  publisher: {
    '@id': `${SITE.url}/#organization`,
  },
}

/** Organization / RealEstate brand */
export const schemaOrganization = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'RealEstateAgent'],
  '@id': `${SITE.url}/#organization`,
  name: `${SITE.name} – ${SITE.agent.brand}`,
  url: SITE.url,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.url}/img/logo.svg`,
  },
  image: SITE.ogImage,
  description: SITE.description,
  telephone: SITE.agent.phone,
  email: SITE.agent.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 50.1895,
    longitude: 14.4038,
  },
  areaServed: {
    '@type': 'City',
    name: 'Klecany',
  },
  sameAs: [
    SITE.social.facebook,
    SITE.social.instagram,
    SITE.social.linkedin,
    SITE.social.youtube,
    SITE.agent.brandUrl,
  ],
}

/** FAQPage */
export const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kde se projekt Bidli v Klecanech nachází?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Projekt se nachází ve městě Klecany v okrese Praha-východ, pouhých 5 km od Prahy. Autem jste na okraji Prahy za 8 minut.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kolik pozemků je v nabídce?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'V nabídce je celkem 13 pozemků s vydaným stavebním povolením na rodinné domy 5+kk.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mohu si vybrat jen pozemek, nebo musím koupit i dům?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Máte svobodnou volbu! Pozemek si můžete koupit samostatně – a dům postavit zcela podle sebe. Nebo si rovnou pořídíte pozemek spolu s rodinným domem 5+kk ve hrubé stavbě k dokončení.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak se dostat z Klecan do Prahy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Autem jste na okraji Prahy za 8 minut. Autobusové linky zajišťují pravidelné dopravní spojení. Mezi břehy Vltavy funguje historický přívoz a cyklisté mohou využít novou cyklostezku vedoucí do Prahy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak kontaktovat prodejce?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dosáhnete nás na telefonním čísle +420 774 110 007 nebo e-mailem info@bidli.cz.',
      },
    },
  ],
}

/** ItemList schema pro pozemky */
export const schemaPozemky = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE.url}/pozemky#listing`,
  name: 'Klecany – nabídka pozemků a domů',
  description: '13 pozemků s vydaným stavebním povolením v Klecanech 5 km od Prahy. Vyberte si pozemek nebo pozemek s domem 5+kk ve hrubé stavbě.',
  numberOfItems: 13,
  url: `${SITE.url}/pozemky`,
  provider: { '@id': `${SITE.url}/#organization` },
}

// Aliases
export const schemaDomy = schemaPozemky
export const schemaByty = schemaPozemky

/** BreadcrumbList builder */
export function schemaBreadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Domů',
        item: SITE.url,
      },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.name,
        item: `${SITE.url}${item.path}`,
      })),
    ],
  }
}

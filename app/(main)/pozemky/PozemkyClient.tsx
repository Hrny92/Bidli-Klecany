'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import GallerySection, { type SanityGalleryAlbum } from '@/components/GallerySection'
import ModalCarousel, { type ModalFile } from '@/components/ModalCarousel'

// ─── Koordináty pozemků (SVG viewBox 0 0 7680 2632) ──────────────────────────

const PLOT_COORDS: { number: string; points: string; cx: number; cy: number }[] = [
  { number: '1',  points: '471.93 439.74 237.2 1027.17 226.47 1151.09 244.35 1202.33 286.05 1221.39 738.93 1218.01 798.2 452.06',                                                                          cx: 429,  cy: 959  },
  { number: '2',  points: '1216.64 467.33 798.2 452.06 738.93 1218.01 1167.34 1214.35',                                                                                                                    cx: 980,  cy: 838  },
  { number: '3',  points: '1633.6 482.37 1216.64 467.33 1167.34 1214.35 1596.09 1209.45',                                                                                                                  cx: 1403, cy: 843  },
  { number: '4',  points: '2052.43 497.97 1633.6 482.37 1596.09 1209.45 2024.13 1205.27',                                                                                                                  cx: 1827, cy: 849  },
  { number: '5',  points: '2471.69 513.1 2052.43 497.97 2024.13 1205.27 2451.18 1201.56',                                                                                                                  cx: 2250, cy: 854  },
  { number: '6',  points: '2897.67 542.57 2471.69 513.1 2451.18 1201.56 2887.13 1196.77',                                                                                                                  cx: 2677, cy: 864  },
  { number: '7',  points: '3347.08 572.38 2897.67 542.57 2887.13 1196.77 3344.1 1192.95',                                                                                                                  cx: 3119, cy: 876  },
  { number: '8',  points: '3826.21 605.2 3347.08 572.38 3344.1 1192.95 3831.42 1188.5',                                                                                                                    cx: 3587, cy: 890  },
  { number: '9',  points: '4351.33 646.77 3826.21 605.2 3831.42 1188.5 4363.9 1183.74',                                                                                                                    cx: 4093, cy: 906  },
  { number: '10', points: '4941.65 705.67 4351.33 646.77 4363.9 1183.74 4962.83 1177.53',                                                                                                                  cx: 4655, cy: 928  },
  { number: '11', points: '5550.63 773.56 4941.65 705.67 4962.83 1177.53 4964.77 1221.87 5550.63 1237.06',                                                                                                 cx: 5194, cy: 1023 },
  { number: '12', points: '6276.75 870.87 5550.63 773.56 5550.63 1237.06 5832.49 1243.44 6044.29 1249.21 6066.54 1249.21 6207.46 1278.88',                                                                 cx: 5933, cy: 1129 },
  { number: '13', points: '7574.09 1045.52 6276.75 870.87 6207.46 1278.88 6197.64 1363.04 6720.27 1468.63 7574.09 1094.13',                                                                                cx: 6758, cy: 1187 },
]

const STATUS_COLOR: Record<string, string> = {
  'volný':       '#22c55e',
  'rezervováno': '#f97316',
  'prodáno':     '#9ca3af',
}

// ─────────────────────────────────────────────────────────────────────────────

export type PlotStatus = 'volný' | 'rezervováno' | 'prodáno'
export type OfferType = 'pozemek' | 'dum' | 'oboje'

export interface SanityPlot {
  _id: string
  number: string
  status: PlotStatus
  hidden?: boolean
  offerType?: OfferType
  plotSize?: string
  floorArea?: string
  disposition?: string
  price?: string
  priceWithHouse?: string
  description?: string
  descriptionWithHouse?: string
  photos?: string[]
  floorPlans?: ModalFile[]
  catalogSheets?: ModalFile[]
}

const statusConfig: Record<PlotStatus, { label: string; badge: string; dot: string; text: string }> = {
  'volný':       { label: 'Volný',     badge: 'bg-green-100 text-green-700 border-green-200',   dot: 'bg-green-500',  text: 'text-green-600' },
  'rezervováno': { label: 'Rezervace', badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400', text: 'text-orange-500' },
  'prodáno':     { label: 'Prodáno',   badge: 'bg-gray-100 text-gray-500 border-gray-200',       dot: 'bg-gray-400',   text: 'text-gray-400' },
}

const offerTypeConfig: Record<OfferType, { label: string; color: string; bg: string; icon: string }> = {
  'pozemek': { label: 'Jen pozemek',          color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: '📐' },
  'dum':     { label: 'Pozemek + dům',        color: 'text-accent',     bg: 'bg-orange-50 border-orange-200', icon: '🏠' },
  'oboje':   { label: 'Pozemek nebo s domem', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: '✨' },
}

function StatusBadge({ status }: { status: PlotStatus }) {
  const { label, badge } = statusConfig[status]
  return (
    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border ${badge}`}>
      {label.toUpperCase()}
    </span>
  )
}

function OfferBadge({ offerType }: { offerType?: OfferType }) {
  const type = offerType ?? 'oboje'
  const { label, color, bg, icon } = offerTypeConfig[type]
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${bg} ${color}`}>
      {icon} {label}
    </span>
  )
}

interface Props {
  plots: SanityPlot[]
  galleryImages?: string[]
  albums?: SanityGalleryAlbum[]
}

export default function PozemkyClient({ plots, galleryImages = [], albums }: Props) {
  const searchParams = useSearchParams()
  const [selectedPlot, setSelectedPlot] = useState<SanityPlot | null>(null)
  const [activeFilter, setActiveFilter] = useState<'pozemek' | 'dum'>('pozemek')
  const [hoveredNumber, setHoveredNumber] = useState<string | null>(null)
  const onPlotEnter = useCallback((n: string) => setHoveredNumber(n), [])
  const onPlotLeave = useCallback(() => setHoveredNumber(null), [])

  // Načteme filter z URL parametru (z homepage CTA tlačítek)
  useEffect(() => {
    const typ = searchParams.get('typ')
    if (typ === 'dum') setActiveFilter('dum')
    else setActiveFilter('pozemek')
  }, [searchParams])

  const visiblePlots = plots.filter((p) => {
    if (p.hidden) return false
    if (activeFilter === 'pozemek') return p.offerType === 'pozemek' || p.offerType === 'oboje' || !p.offerType
    if (activeFilter === 'dum') return p.offerType === 'dum' || p.offerType === 'oboje'
    return true
  })

  return (
    <>
      {/* HERO */}
      <section className="relative p-2 h-[40vh] min-h-[400px]">
        <div className="relative flex flex-col justify-center h-full rounded-[3rem] overflow-hidden bg-gray-900">
          <img
            src="/img/Exteri%C3%A9r%20-%20lokalita/01%20-%20%C3%BAvodn%C3%AD%20foto%20(kopie).jpg"
            alt="Klecany – nabídka pozemků"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
          <div className="relative z-10 container mx-auto px-6 mt-16 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Nabídka <span className="text-accent">pozemků</span>
              </h1>
              <p className="text-lg md:text-xl font-light opacity-90">
                Vyberte si: jen pozemek s stavebním povolením, nebo rovnou pozemek s domem 5+kk ve hrubé stavbě.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PŘEPÍNAČ FILTRU – klíčový feature */}
      <section className="container mx-auto px-6 pt-12 pb-4">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-gray-500 text-sm uppercase tracking-widest font-bold mb-4">Co hledáte?</p>
          <div className="flex rounded-[2rem] border border-gray-200 bg-gray-50 p-1.5 gap-1">
            <button
              onClick={() => setActiveFilter('pozemek')}
              className={`flex-1 py-3 px-4 rounded-[1.5rem] text-sm font-bold transition-all duration-200 ${
                activeFilter === 'pozemek'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              📐 Pozemek
            </button>
            <button
              onClick={() => setActiveFilter('dum')}
              className={`flex-1 py-3 px-4 rounded-[1.5rem] text-sm font-bold transition-all duration-200 ${
                activeFilter === 'dum'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              🏠 Pozemek s domem
            </button>
          </div>
        </div>
      </section>

      {/* LEGENDA */}
      <section className="container mx-auto px-6 pb-4">
        <div className="flex flex-wrap justify-center gap-4">
          {(Object.entries(statusConfig) as [PlotStatus, typeof statusConfig[PlotStatus]][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-3 h-3 rounded-full ${val.dot}`} />
              {val.label}
            </div>
          ))}
        </div>
      </section>

      {/* INTERAKTIVNÍ MAPA */}
      <section className="py-8 md:py-12 container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Situace lokality</h2>
          <p className="text-gray-600 font-light text-lg">Klikněte na pozemek pro zobrazení detailu.</p>
        </div>

        {/* Mapa – oba obrázky jsou vždy načteny, přepíná se jen viditelnost */}
        <div className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 bg-gray-100">
          <img
            src="/img/Pozemky.png"
            alt="Situace – pozemky"
            loading="eager"
            className={`w-full h-auto object-contain transition-opacity duration-300 ${
              activeFilter === 'pozemek' ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 w-full h-full'
            }`}
          />
          <img
            src="/img/Domy.png"
            alt="Situace – pozemky s domy"
            loading="eager"
            className={`w-full h-auto object-contain transition-opacity duration-300 ${
              activeFilter === 'dum' ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 w-full h-full'
            }`}
          />
          {/* Interaktivní SVG overlay – kliknutím otevřeš detail pozemku */}
          <svg
            viewBox="0 0 7680 2632"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          >
            {PLOT_COORDS.map(({ number, points, cx, cy }) => {
              const plot = plots.find(p => p.number === number && !p.hidden)
              if (!plot) return null
              const color = STATUS_COLOR[plot.status] ?? '#9ca3af'
              const hovered = hoveredNumber === number
              return (
                <g
                  key={number}
                  style={{ cursor: 'pointer', pointerEvents: 'all' }}
                  onClick={() => setSelectedPlot(plot)}
                  onMouseEnter={() => onPlotEnter(number)}
                  onMouseLeave={onPlotLeave}
                >
                  <polygon
                    points={points}
                    fill={color}
                    fillOpacity={hovered ? 0.55 : 0.22}
                    stroke={color}
                    strokeWidth={hovered ? 14 : 7}
                    strokeOpacity={0.9}
                    style={{ transition: 'fill-opacity 0.15s, stroke-width 0.15s' }}
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={90}
                    fontWeight="bold"
                    paintOrder="stroke"
                    stroke="rgba(0,0,0,0.55)"
                    strokeWidth={22}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {number}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legenda pod mapou */}
        <div className="flex flex-wrap justify-center gap-4 mt-5 text-sm text-gray-600">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Volný</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400" /> Rezervace</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400" /> Prodáno</div>
        </div>
      </section>

      {/* TABULKA POZEMKŮ */}
      <section className="py-12 relative overflow-hidden bg-gray-50 rounded-[3rem] mx-2 md:mx-6 mb-12">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            {activeFilter === 'pozemek'
              ? <>Pozemky <span className="text-accent">({visiblePlots.length})</span></>
              : <>Pozemky s domem 5+kk <span className="text-accent">({visiblePlots.length})</span></>}
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            {activeFilter === 'pozemek'
              ? 'Koupíte pozemek s platným stavebním povolením a dům postavíte dle vlastního vkusu.'
              : 'K pozemku dostanete rodinný dům 5+kk ve hrubé stavbě k dokončení.'}
          </p>
          <div className="w-full bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs md:text-sm uppercase tracking-wider">
                    {['Pozemek', 'Plocha pozemku', 'Plocha domu', 'Dispozice', 'Cena', 'Stav'].map((h) => (
                      <th key={h} className={`p-5 md:p-6 font-medium ${h === 'Stav' ? 'text-center' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {visiblePlots.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-400">
                        Žádné pozemky v této kategorii.
                      </td>
                    </tr>
                  ) : visiblePlots.map((plot) => (
                    <tr
                      key={plot._id}
                      onClick={() => setSelectedPlot(plot)}
                      className={`hover:bg-gray-50 transition-colors group cursor-pointer ${plot.status === 'prodáno' ? 'opacity-60' : ''}`}
                    >
                      <td className="p-5 md:p-6 font-black text-lg text-gray-900">#{plot.number}</td>
                      <td className="p-5 md:p-6 text-gray-900 font-medium">{plot.plotSize ?? '–'}</td>
                      <td className="p-5 md:p-6 text-gray-900 font-medium">{plot.floorArea ?? '–'}</td>
                      <td className="p-5 md:p-6 text-gray-600">{plot.disposition ?? '5+kk'}</td>
                      <td className="p-5 md:p-6 font-bold text-gray-900 group-hover:text-accent transition-colors">
                        {activeFilter === 'dum' && plot.priceWithHouse ? plot.priceWithHouse : (plot.price ?? '–')}
                      </td>
                      <td className="p-5 md:p-6 text-center"><StatusBadge status={plot.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="block md:hidden text-center py-3 bg-gray-50 border-t border-gray-100 text-gray-500 text-xs">
              ← Posunutím zobrazíte další informace →
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <GallerySection
        groups={['exteriery', 'interiery', 'pudorysy']}
        title="Galerie projektu"
        albums={albums ?? []}
      />

      {/* DETAIL MODAL */}
      {selectedPlot && (
        <div
          className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6"
          onClick={() => setSelectedPlot(null)}
        >
          <div
            className="relative bg-white w-full h-full md:h-auto md:max-h-[92vh] md:max-w-5xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPlot(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-gray-100 flex items-center justify-center shadow-md transition-all"
              aria-label="Zavřít"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* LEVÝ SLOUPEC */}
            <div className="w-full md:w-[42%] flex flex-col p-8 md:p-10 overflow-y-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                <StatusBadge status={selectedPlot.status} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-2 leading-tight">
                Pozemek #{selectedPlot.number}
              </h2>

              {/* Popis pozemku */}
              <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                {selectedPlot.description ??
                  'Exkluzivní pozemek s vydaným stavebním povolením na rodinný dům 5+kk v Klecanech, 5 km od Prahy. Dokončení exteriérů a interiérů realizuje kupující po vlastní ose.'}
              </p>

              {/* Parametry */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Plocha pozemku</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedPlot.plotSize ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Plocha domu</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedPlot.floorArea ?? '–'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Dispozice</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedPlot.disposition ?? '5+kk'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Stavební povolení</p>
                  <p className="text-lg font-bold text-green-600">Vydáno ✓</p>
                </div>
              </div>

              {/* Cena – zobrazujeme obě možnosti pokud existují */}
              <div className="space-y-3 mb-8">
                {(selectedPlot.offerType === 'pozemek' || selectedPlot.offerType === 'oboje' || !selectedPlot.offerType) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-xs text-blue-600 uppercase tracking-widest mb-1 font-bold">📐 Jen pozemek</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedPlot.price ?? 'Info u makléře'}</p>
                  </div>
                )}
                {(selectedPlot.offerType === 'dum' || selectedPlot.offerType === 'oboje') && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                    <p className="text-xs text-accent uppercase tracking-widest mb-1 font-bold">🏠 Pozemek + dům 5+kk</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedPlot.priceWithHouse ?? 'Info u makléře'}</p>
                    {selectedPlot.descriptionWithHouse && (
                      <p className="text-xs text-gray-500 mt-2 font-light">{selectedPlot.descriptionWithHouse}</p>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/#Kontakt"
                onClick={() => setSelectedPlot(null)}
                className="flex items-center justify-center w-full bg-accent hover:bg-accentDark text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 group shadow-[0_0_20px_rgba(239,134,37,0.3)] mt-auto"
              >
                Mám zájem
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* PRAVÝ SLOUPEC – obrázky */}
            <div className="w-full md:w-[58%] bg-gray-50 flex flex-col min-h-[320px] md:min-h-0 border-t md:border-t-0 md:border-l border-gray-100">
              {(selectedPlot.photos?.filter(Boolean).length ?? 0) === 0 && galleryImages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-pink-500">
                  <span className="text-white/60 text-sm font-bold uppercase tracking-widest select-none">
                    Fotografie / vizualizace
                  </span>
                </div>
              ) : (
                <ModalCarousel
                  images={
                    (selectedPlot.photos?.filter(Boolean).length ?? 0) > 0
                      ? selectedPlot.photos!.filter(Boolean)
                      : galleryImages
                  }
                  floorPlans={selectedPlot.floorPlans ?? []}
                  catalogSheets={selectedPlot.catalogSheets ?? []}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

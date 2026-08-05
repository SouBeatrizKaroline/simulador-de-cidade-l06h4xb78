import React, { useState } from 'react'
import { useGame } from '@/game/GameContext'
import { STRUCTURES, OBRAS } from '@/game/constants'
import { CategoryKey } from '@/types/game'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { X, Hammer, ChevronDown, ChevronRight, Info } from 'lucide-react'

const CATEGORY_NAMES: Record<CategoryKey, { name: string; icon: string }> = {
  residencial: { name: 'Residencial & Lazer', icon: '🏡' },
  economia: { name: 'Comércio & Indústria', icon: '🏭' },
  energia: { name: 'Energia', icon: '⚡' },
  agua: { name: 'Água & Saneamento', icon: '💧' },
  saude: { name: 'Saúde', icon: '🏥' },
  educacao: { name: 'Educação', icon: '🎓' },
  transporte: { name: 'Transporte', icon: '🚗' },
  seguranca: { name: 'Segurança', icon: '👮' },
}

export const BuildPanel: React.FC = () => {
  const {
    state,
    selectedStructure,
    setSelectedStructure,
    selectedObraId,
    setSelectedObraId,
    setTaxRate,
  } = useGame()

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    residencial: true,
    economia: true,
    energia: true,
  })

  const [expandedObras, setExpandedObras] = useState(false)

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const categories: CategoryKey[] = [
    'residencial',
    'economia',
    'energia',
    'agua',
    'saude',
    'educacao',
    'transporte',
    'seguranca',
  ]

  return (
    <aside className="w-full lg:w-80 bg-[#111a2e] border-r border-slate-800 flex flex-col h-full overflow-hidden text-slate-200">
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hammer className="w-5 h-5 text-sky-400" />
          <h2 className="font-bold text-sm tracking-wide text-white">Construir & Gestão</h2>
        </div>
        {(selectedStructure || selectedObraId) && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setSelectedStructure(null)
              setSelectedObraId(null)
            }}
            className="h-7 px-2 text-xs gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Cancelar
          </Button>
        )}
      </div>

      <div className="p-3 border-b border-slate-800 bg-slate-900/30">
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="text-slate-300 font-medium">Taxa de Impostos:</span>
          <span className="font-mono font-bold text-amber-400">{state.taxRate}%</span>
        </div>
        <Slider
          value={[state.taxRate]}
          min={0}
          max={40}
          step={1}
          onValueChange={(vals) => setTaxRate(vals[0])}
          className="my-2"
        />
        <p className="text-[10px] text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-sky-400 shrink-0" />
          Impostos altos geram mais receita, mas reduzem a felicidade.
        </p>
      </div>

      {selectedStructure && (
        <div className="bg-sky-950/80 border-b border-sky-800/80 p-2.5 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedStructure.icon}</span>
            <div>
              <div className="font-bold text-sky-200">{selectedStructure.name}</div>
              <div className="text-[10px] text-sky-400">Clique num lote livre no mapa</div>
            </div>
          </div>
        </div>
      )}

      {selectedObraId && (
        <div className="bg-amber-950/80 border-b border-amber-800/80 p-2.5 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏗️</span>
            <div>
              <div className="font-bold text-amber-200">
                {OBRAS.find((o) => o.id === selectedObraId)?.name}
              </div>
              <div className="text-[10px] text-amber-400">
                Clique num lote livre para iniciar a obra
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {categories.map((cat) => {
          const structs = STRUCTURES.filter((s) => s.category === cat)
          const isExpanded = Boolean(expandedCategories[cat])
          const catInfo = CATEGORY_NAMES[cat]

          return (
            <div
              key={cat}
              className="rounded-lg border border-slate-800/80 bg-slate-900/40 overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full px-3 py-2 text-xs font-semibold flex items-center justify-between bg-slate-900/80 text-slate-200 hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  <span>{catInfo.icon}</span>
                  <span>{catInfo.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-2 space-y-2">
                  {structs.map((struct) => {
                    const canAfford = state.money >= struct.cost
                    const isSelected = selectedStructure?.id === struct.id

                    return (
                      <div
                        key={struct.id}
                        onClick={() => {
                          if (canAfford) {
                            setSelectedObraId(null)
                            setSelectedStructure(isSelected ? null : struct)
                          }
                        }}
                        className={`p-2 rounded border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-sky-500 bg-sky-950/40 shadow-sm'
                            : canAfford
                              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60'
                              : 'border-slate-800/50 bg-slate-950/40 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{struct.icon}</span>
                            <div>
                              <div className="font-semibold text-xs text-slate-100">
                                {struct.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Manut: R$ {struct.maintenance}/mês
                              </div>
                            </div>
                          </div>
                          <span
                            className={`font-mono text-xs font-bold ${
                              canAfford ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            R$ {(struct.cost / 1000).toFixed(0)}k
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {Object.entries(struct.effects).map(([key, val]) => {
                            if (!val) return null
                            const isPos = val > 0
                            return (
                              <span
                                key={key}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                                  isPos
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                                }`}
                              >
                                {isPos ? `+${val}` : val} {key}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div className="rounded-lg border border-amber-800/40 bg-amber-950/10 overflow-hidden">
          <button
            onClick={() => setExpandedObras(!expandedObras)}
            className="w-full px-3 py-2 text-xs font-semibold flex items-center justify-between bg-amber-950/40 text-amber-200 hover:bg-amber-900/30 transition"
          >
            <div className="flex items-center gap-2">
              <span>🏗️</span>
              <span>Obras Especiais ({OBRAS.length})</span>
            </div>
            {expandedObras ? (
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {expandedObras && (
            <div className="p-2 space-y-2">
              {OBRAS.map((obra) => {
                const canAfford = state.money >= obra.cost
                const isSelected = selectedObraId === obra.id

                return (
                  <div
                    key={obra.id}
                    onClick={() => {
                      if (canAfford) {
                        setSelectedStructure(null)
                        setSelectedObraId(isSelected ? null : obra.id)
                      }
                    }}
                    className={`p-2 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/40 shadow'
                        : canAfford
                          ? 'border-amber-800/50 bg-slate-900/80 hover:border-amber-700'
                          : 'border-slate-800 bg-slate-950/40 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{obra.icon}</span>
                        <div>
                          <div className="font-semibold text-xs text-amber-100">{obra.name}</div>
                          <div className="text-[10px] text-amber-400">
                            Duração: {obra.duration} meses
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-300">
                        R$ {(obra.cost / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{obra.description}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

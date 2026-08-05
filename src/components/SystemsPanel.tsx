import React from 'react'
import { useGame } from '@/game/GameContext'
import { SystemKey } from '@/types/game'
import { Button } from '@/components/ui/button'
import { Activity, RotateCcw, ScrollText } from 'lucide-react'

const SYSTEMS: { key: SystemKey; label: string; icon: string }[] = [
  { key: 'energia', label: 'Energia', icon: '⚡' },
  { key: 'agua', label: 'Água', icon: '💧' },
  { key: 'saude', label: 'Saúde', icon: '🏥' },
  { key: 'educacao', label: 'Educação', icon: '🎓' },
  { key: 'transporte', label: 'Transporte', icon: '🚗' },
  { key: 'seguranca', label: 'Segurança', icon: '👮' },
  { key: 'economia', label: 'Economia', icon: '🏭' },
  { key: 'meioAmbiente', label: 'Meio Ambiente', icon: '🌳' },
  { key: 'felicidade', label: 'Felicidade', icon: '😊' },
]

function getBarColor(val: number): string {
  if (val >= 70) return 'bg-emerald-500'
  if (val >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

function getTextColor(val: number): string {
  if (val >= 70) return 'text-emerald-400'
  if (val >= 40) return 'text-amber-400'
  return 'text-rose-400'
}

export const SystemsPanel: React.FC = () => {
  const { state, newGame } = useGame()

  return (
    <aside className="w-full lg:w-72 bg-[#111a2e] border-l border-slate-800 flex flex-col h-full overflow-hidden text-slate-200">
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-sm text-white">Sistemas da Cidade</h2>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={newGame}
          className="h-7 px-2 text-xs gap-1 text-slate-400 hover:text-rose-400"
        >
          <RotateCcw className="w-3 h-3" />
          Reiniciar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {SYSTEMS.map((sys) => {
          const val = state.systems[sys.key]
          return (
            <div key={sys.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span>{sys.icon}</span>
                  {sys.label}
                </span>
                <span className={`font-mono font-bold ${getTextColor(val)}`}>
                  {Math.round(val)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getBarColor(val)}`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          )
        })}

        <div className="pt-2 border-t border-slate-800 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">💰 Impostos</span>
            <span className="font-mono text-amber-400 font-bold">{state.taxRate}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">🏗️ Obras Ativas</span>
            <span className="font-mono text-sky-400 font-bold">{state.activeObras.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">⚠️ Próx. Evento</span>
            <span className="font-mono text-rose-400 font-bold">
              {state.systems.eventos} turnos
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
            <ScrollText className="w-3.5 h-3.5 text-sky-400" />
            Registro de Eventos
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {state.eventLog.map((log) => (
              <div
                key={log.id}
                className={`text-[10px] p-1.5 rounded border ${
                  log.type === 'danger'
                    ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                    : log.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                      : log.type === 'success'
                        ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-start gap-1">
                  <span>{log.icon}</span>
                  <div>
                    <div className="font-semibold">{log.title}</div>
                    <div className="text-slate-500">Turno {log.turn}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

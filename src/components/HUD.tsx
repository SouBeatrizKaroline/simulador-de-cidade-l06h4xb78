import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGame } from '@/game/GameContext'
import { Button } from '@/components/ui/button'
import { Play, Pause, FastForward, BarChart2, Heart, Percent, Building2 } from 'lucide-react'

export const HUD: React.FC = () => {
  const { state, setSpeed } = useGame()
  const navigate = useNavigate()

  const year = Math.floor((state.turn - 1) / 12) + 1
  const month = ((state.turn - 1) % 12) + 1

  const happinessColor =
    state.systems.felicidade >= 70
      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
      : state.systems.felicidade >= 40
        ? 'text-amber-400 bg-amber-950/60 border-amber-800'
        : 'text-rose-400 bg-rose-950/60 border-rose-800'

  return (
    <header className="h-16 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between text-slate-200 select-none z-30 sticky top-0">
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-sky-400 text-lg hover:opacity-90 transition"
      >
        <Building2 className="w-6 h-6 text-sky-400" />
        <span className="hidden sm:inline tracking-tight text-white">Simulador de Cidade</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-emerald-400 font-bold">💰</span>
          <span
            className={`font-mono text-sm sm:text-base font-semibold ${
              state.money < 0 ? 'text-rose-400' : 'text-emerald-300'
            }`}
          >
            R$ {state.money.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-sky-400 font-bold">👥</span>
          <span className="font-mono text-sm sm:text-base font-semibold text-slate-200">
            {state.population.toLocaleString('pt-BR')}
            <span className="text-xs text-slate-400 font-normal ml-1">
              / {state.housingCapacity}
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
          <span>📅</span>
          <span className="font-mono text-xs sm:text-sm">
            Mês {month} · Ano {year}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs sm:text-sm font-bold ${happinessColor}`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>{Math.round(state.systems.felicidade)}%</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-300 text-xs sm:text-sm font-semibold">
          <Percent className="w-3.5 h-3.5 text-amber-400" />
          <span>Imposto {state.taxRate}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => setSpeed(0)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
              state.speed === 0
                ? 'bg-rose-500/20 text-rose-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Pausar jogo"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSpeed(1)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
              state.speed === 1
                ? 'bg-sky-500/20 text-sky-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Velocidade Normal"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSpeed(2)}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
              state.speed === 2
                ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Velocidade Rápida (x2)"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/estatisticas')}
          className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-1.5 text-xs sm:text-sm"
        >
          <BarChart2 className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Estatísticas</span>
        </Button>
      </div>
    </header>
  )
}

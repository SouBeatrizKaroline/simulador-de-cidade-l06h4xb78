import React from 'react'
import { useGame } from '@/game/GameContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/Confetti'
import { BarChart2, RotateCcw } from 'lucide-react'

export const GameEndScreen: React.FC = () => {
  const { state, newGame } = useGame()
  const navigate = useNavigate()

  if (!state.isGameOver && !state.isVictory) return null

  const isVictory = state.isVictory
  const year = Math.floor((state.turn - 1) / 12) + 1
  const month = ((state.turn - 1) % 12) + 1

  const stats = [
    { label: 'Tempo de Jogo', value: `${month} meses · ${year} ano(s)` },
    { label: 'População Final', value: state.population.toLocaleString('pt-BR') },
    { label: 'Dinheiro Final', value: `R$ ${state.money.toLocaleString('pt-BR')}` },
    {
      label: 'Impostos Arrecadados',
      value: `R$ ${state.totalTaxesCollected.toLocaleString('pt-BR')}`,
    },
    { label: 'Eventos Sobrevividos', value: state.totalEventsSurvived.toString() },
    {
      label: 'Construções',
      value: `${state.totalBuildingsBuilt} feitas · ${state.totalBuildingsDemolished} demolidas`,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      {isVictory && <Confetti />}

      <div
        className={`relative z-10 max-w-md w-full mx-4 rounded-2xl border p-6 ${
          isVictory ? 'bg-emerald-950/90 border-emerald-700' : 'bg-rose-950/90 border-rose-700'
        }`}
      >
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">{isVictory ? '🏆' : '💀'}</div>
          <h2 className={`text-2xl font-bold ${isVictory ? 'text-emerald-300' : 'text-rose-300'}`}>
            {isVictory ? 'Vitória!' : 'Fim de Jogo'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isVictory
              ? 'Sua cidade alcançou 10.000 habitantes com felicidade elevada!'
              : state.population <= 0
                ? 'Todos os habitantes deixaram a cidade...'
                : 'A cidade faliu após meses de déficit severo.'}
          </p>
        </div>

        <div className="space-y-2 mb-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-1.5"
            >
              <span className="text-slate-400">{s.label}</span>
              <span className="font-mono font-semibold text-slate-200">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-1.5 border-slate-700 text-slate-200"
            onClick={() => navigate('/estatisticas')}
          >
            <BarChart2 className="w-4 h-4" />
            Estatísticas
          </Button>
          <Button
            className={`flex-1 gap-1.5 ${
              isVictory ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700'
            }`}
            onClick={newGame}
          >
            <RotateCcw className="w-4 h-4" />
            Novo Jogo
          </Button>
        </div>
      </div>
    </div>
  )
}

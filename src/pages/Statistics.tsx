import { useGame } from '@/game/GameContext'
import { Link } from 'react-router-dom'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, DollarSign, Heart, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts'

const chartConfig: ChartConfig = {
  population: { label: 'População', color: 'hsl(var(--chart-1))' },
  money: { label: 'Dinheiro', color: 'hsl(var(--chart-2))' },
  felicidade: { label: 'Felicidade', color: 'hsl(var(--chart-3))' },
  economia: { label: 'Economia', color: 'hsl(var(--chart-4))' },
}

export default function Statistics() {
  const { state } = useGame()
  const history = state.history

  const summaryCards = [
    {
      label: 'População',
      value: state.population.toLocaleString('pt-BR'),
      icon: Users,
      color: 'text-sky-400',
    },
    {
      label: 'Dinheiro',
      value: `R$ ${state.money.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'text-emerald-400',
    },
    {
      label: 'Felicidade',
      value: `${Math.round(state.systems.felicidade)}%`,
      icon: Heart,
      color: 'text-rose-400',
    },
    { label: 'Turnos', value: state.turn.toString(), icon: TrendingUp, color: 'text-amber-400' },
  ]

  const generalStats = [
    {
      label: 'Impostos Arrecadados',
      value: `R$ ${state.totalTaxesCollected.toLocaleString('pt-BR')}`,
    },
    { label: 'Eventos Sobrevividos', value: state.totalEventsSurvived.toString() },
    { label: 'Construções Feitas', value: state.totalBuildingsBuilt.toString() },
    { label: 'Demolições', value: state.totalBuildingsDemolished.toString() },
    { label: 'Obras Ativas', value: state.activeObras.length.toString() },
    { label: 'Capacidade Pop.', value: state.housingCapacity.toLocaleString('pt-BR') },
  ]

  return (
    <div className="h-full overflow-y-auto bg-[#0b1220] p-4 lg:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm" asChild className="border-slate-700 text-slate-200">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-white">Estatísticas da Cidade</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {summaryCards.map((s) => (
            <Card key={s.label} className="bg-slate-900/60 border-slate-800">
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className={`w-8 h-8 ${s.color}`} />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{s.label}</div>
                  <div className="font-mono font-bold text-slate-100">{s.value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">População ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48 w-full">
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="turn" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="population"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">Dinheiro ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48 w-full">
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="turn" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="money"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">Felicidade & Economia</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48 w-full">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="turn" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey="felicidade"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="economia"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {generalStats.map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-slate-400">{s.label}:</span>
                  <span className="font-mono text-slate-200">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

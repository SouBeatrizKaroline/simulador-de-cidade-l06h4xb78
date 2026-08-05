import React from 'react'
import { useGame } from '@/game/GameContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle } from 'lucide-react'

export const EventModal: React.FC = () => {
  const { state, resolvePendingEvent } = useGame()
  const evt = state.pendingEvent

  const canMitigate = evt ? state.money >= evt.mitigationCost : false

  return (
    <Dialog open={Boolean(evt)} onOpenChange={() => {}}>
      <DialogContent
        className="bg-slate-900 text-slate-100 border-rose-800/60 sm:max-w-md"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-rose-300">
            <span className="text-3xl">{evt?.icon}</span>
            {evt?.title}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm pt-1">
            {evt?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="bg-rose-950/40 border border-rose-800/50 rounded-lg p-3">
            <div className="text-xs font-semibold text-rose-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Penalidades aplicadas:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {evt &&
                Object.entries(evt.penaltyEffects).map(([key, val]) => (
                  <span
                    key={key}
                    className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50 font-mono"
                  >
                    {val} {key}
                  </span>
                ))}
            </div>
            <div className="text-[10px] text-rose-400 mt-2">Duração: {evt?.duration} meses</div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1 gap-1.5"
              onClick={() => resolvePendingEvent(false)}
            >
              <AlertTriangle className="w-4 h-4" />
              Aceitar Impacto
            </Button>
            <Button
              className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              disabled={!canMitigate}
              onClick={() => resolvePendingEvent(true)}
            >
              <Shield className="w-4 h-4" />
              Mitigar
            </Button>
          </div>

          {!canMitigate && evt && (
            <p className="text-[10px] text-rose-400 text-center">
              Fundos insuficientes para mitigar (R$ {evt.mitigationCost.toLocaleString('pt-BR')})
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

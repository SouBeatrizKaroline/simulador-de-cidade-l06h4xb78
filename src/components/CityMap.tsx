import React, { useState } from 'react'
import { useGame } from '@/game/GameContext'
import { STRUCTURES, OBRAS, GRID_COLS } from '@/game/constants'
import { TileData } from '@/types/game'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

export const CityMap: React.FC = () => {
  const { state, selectedStructure, selectedObraId, buildOnTile, demolishTile, startObraOnTile } =
    useGame()

  const [activeTile, setActiveTile] = useState<TileData | null>(null)

  const handleTileClick = (tile: TileData) => {
    if (selectedStructure && !tile.structureId && !tile.obraId) {
      buildOnTile(tile.id)
      return
    }

    if (selectedObraId && !tile.structureId && !tile.obraId) {
      startObraOnTile(tile.id, selectedObraId)
      return
    }

    if (tile.structureId || tile.obraId) {
      setActiveTile(tile)
    }
  }

  const selectedStructureObj = activeTile?.structureId
    ? STRUCTURES.find((s) => s.id === activeTile.structureId)
    : null

  const selectedObraObj = activeTile?.obraId ? OBRAS.find((o) => o.id === activeTile.obraId) : null

  return (
    <div className="flex-1 bg-[#0b1220] p-4 flex flex-col items-center justify-center overflow-auto relative select-none">
      <div className="max-w-full overflow-auto p-2">
        <div
          className="grid gap-1.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(44px, 56px))`,
          }}
        >
          {state.tiles.map((tile) => {
            const isOccupied = Boolean(tile.structureId || tile.obraId)
            const struct = tile.structureId
              ? STRUCTURES.find((s) => s.id === tile.structureId)
              : null
            const activeObra = tile.obraId
              ? state.activeObras.find((o) => o.tileId === tile.id)
              : null
            const obraDef = activeObra ? OBRAS.find((o) => o.id === activeObra.obraDefId) : null

            const isTargetable = (selectedStructure || selectedObraId) && !isOccupied

            return (
              <div
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center relative transition-all duration-150 group cursor-pointer ${
                  isTargetable
                    ? 'border-2 border-dashed border-emerald-400/80 bg-emerald-950/20 hover:bg-emerald-900/40 hover:scale-105'
                    : isOccupied
                      ? 'border border-slate-700/80 bg-slate-800/90 hover:border-sky-400 hover:scale-105 shadow-md'
                      : 'border border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/40'
                } ${state.activeEvent ? 'animate-pulse' : ''}`}
              >
                {struct && (
                  <span className="text-2xl sm:text-3xl filter drop-shadow">{struct.icon}</span>
                )}

                {obraDef && (
                  <div className="flex flex-col items-center">
                    <span className="text-xl animate-bounce">🏗️</span>
                    <span className="text-[9px] font-mono font-bold text-amber-400">
                      {activeObra?.remainingTurns}m
                    </span>
                  </div>
                )}

                {!isOccupied && !selectedStructure && !selectedObraId && (
                  <span className="text-[9px] text-slate-600 font-mono group-hover:text-slate-400">
                    #{tile.id}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={Boolean(activeTile)} onOpenChange={() => setActiveTile(null)}>
        <DialogContent className="bg-slate-900 text-slate-100 border-slate-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <span className="text-2xl">
                {selectedStructureObj?.icon || selectedObraObj?.icon || '🏙️'}
              </span>
              <span>{selectedStructureObj?.name || selectedObraObj?.name || 'Lote Urbano'}</span>
            </DialogTitle>

            <DialogDescription className="text-slate-400 text-xs">
              Detalhes e gerenciamento da estrutura no Lote #{activeTile?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedStructureObj && (
            <div className="space-y-3 py-2 text-xs">
              <p className="text-slate-300">{selectedStructureObj.description}</p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono space-y-1">
                <div>Custo de manutenção: R$ {selectedStructureObj.maintenance}/mês</div>
                {selectedStructureObj.housingCap && (
                  <div>Capacidade Habitacional: +{selectedStructureObj.housingCap} pessoas</div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (activeTile) {
                      demolishTile(activeTile.id)
                      setActiveTile(null)
                    }
                  }}
                  className="gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Demolir (Reembolso 50%)
                </Button>
              </div>
            </div>
          )}

          {selectedObraObj && (
            <div className="space-y-3 py-2 text-xs">
              <p className="text-slate-300">{selectedObraObj.description}</p>
              <div className="bg-amber-950/40 p-2.5 rounded border border-amber-800/60 text-amber-200">
                <div className="font-bold mb-1">Obra em andamento:</div>
                <div>
                  Turnos restantes:{' '}
                  {state.activeObras.find((o) => o.tileId === activeTile?.id)?.remainingTurns} meses
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

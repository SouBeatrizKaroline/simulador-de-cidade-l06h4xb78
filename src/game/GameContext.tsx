import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { GameState, StructureDef } from '@/types/game'
import { INITIAL_GAME_STATE } from './constants'
import {
  tickTurn,
  placeBuilding,
  demolishBuilding,
  startObraAction,
  resolveEventAction,
  setTaxRateAction,
  calculateSystems,
} from './engine'

const SAVE_KEY = 'simulador_cidade_save_v1'

interface GameContextType {
  state: GameState
  selectedStructure: StructureDef | null
  selectedObraId: string | null
  setSelectedStructure: (s: StructureDef | null) => void
  setSelectedObraId: (id: string | null) => void
  setSpeed: (speed: 0 | 1 | 2) => void
  buildOnTile: (tileId: number) => void
  demolishTile: (tileId: number) => void
  startObraOnTile: (tileId: number, obraId: string) => void
  resolvePendingEvent: (mitigate: boolean) => void
  setTaxRate: (rate: number) => void
  newGame: () => void
  hasSavedGame: boolean
  loadSavedGame: () => boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const recalc = calculateSystems(parsed)
        return { ...parsed, systems: recalc.systems }
      } catch (e) {
        console.error('Error loading save:', e)
      }
    }
    return INITIAL_GAME_STATE
  })

  const [selectedStructure, setSelectedStructure] = useState<StructureDef | null>(null)
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null)

  const hasSavedGame = Boolean(localStorage.getItem(SAVE_KEY))

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (state.speed === 0 || state.isGameOver || state.isVictory || state.pendingEvent) {
      return
    }

    const intervalTime = state.speed === 1 ? 2500 : 1200
    const timer = setInterval(() => {
      setState((prev) => tickTurn(prev))
    }, intervalTime)

    return () => clearInterval(timer)
  }, [state.speed, state.isGameOver, state.isVictory, state.pendingEvent])

  const setSpeed = useCallback((speed: 0 | 1 | 2) => {
    setState((prev) => ({ ...prev, speed }))
  }, [])

  const buildOnTile = useCallback(
    (tileId: number) => {
      if (!selectedStructure) return
      setState((prev) => placeBuilding(prev, tileId, selectedStructure.id))
      setSelectedStructure(null)
    },
    [selectedStructure],
  )

  const demolishTile = useCallback((tileId: number) => {
    setState((prev) => demolishBuilding(prev, tileId))
  }, [])

  const startObraOnTile = useCallback((tileId: number, obraId: string) => {
    setState((prev) => startObraAction(prev, tileId, obraId))
    setSelectedObraId(null)
  }, [])

  const resolvePendingEvent = useCallback((mitigate: boolean) => {
    setState((prev) => resolveEventAction(prev, mitigate))
  }, [])

  const setTaxRate = useCallback((rate: number) => {
    setState((prev) => setTaxRateAction(prev, rate))
  }, [])

  const newGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY)
    const fresh = { ...INITIAL_GAME_STATE }
    const recalc = calculateSystems(fresh)
    setState({ ...fresh, systems: recalc.systems })
    setSelectedStructure(null)
    setSelectedObraId(null)
  }, [])

  const loadSavedGame = useCallback(() => {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const recalc = calculateSystems(parsed)
        setState({ ...parsed, systems: recalc.systems })
        return true
      } catch {
        return false
      }
    }
    return false
  }, [])

  return (
    <GameContext.Provider
      value={{
        state,
        selectedStructure,
        selectedObraId,
        setSelectedStructure,
        setSelectedObraId,
        setSpeed,
        buildOnTile,
        demolishTile,
        startObraOnTile,
        resolvePendingEvent,
        setTaxRate,
        newGame,
        hasSavedGame,
        loadSavedGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}

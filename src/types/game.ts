export type SystemKey =
  | 'energia'
  | 'agua'
  | 'saude'
  | 'educacao'
  | 'transporte'
  | 'seguranca'
  | 'economia'
  | 'meioAmbiente'
  | 'felicidade'
  | 'impostos'
  | 'obras'
  | 'eventos'

export type CategoryKey =
  | 'energia'
  | 'agua'
  | 'saude'
  | 'educacao'
  | 'transporte'
  | 'seguranca'
  | 'economia'
  | 'residencial'

export interface StructureDef {
  id: string
  name: string
  category: CategoryKey
  icon: string
  cost: number
  maintenance: number
  housingCap?: number
  effects: Partial<Record<SystemKey, number>>
  description: string
}

export interface TileData {
  id: number
  x: number
  y: number
  structureId?: string
  obraId?: string
}

export interface ObraDef {
  id: string
  name: string
  icon: string
  cost: number
  duration: number
  disruptionEffects: Partial<Record<SystemKey, number>>
  completionEffects: Partial<Record<SystemKey, number>>
  description: string
}

export interface ActiveObra {
  id: string
  obraDefId: string
  tileId: number
  remainingTurns: number
  totalTurns: number
}

export interface ClimateEventDef {
  id: string
  title: string
  icon: string
  duration: number
  description: string
  penaltyEffects: Partial<Record<SystemKey, number>>
  mitigationCost: number
  mitigationLabel: string
}

export interface ActiveEvent {
  eventDefId: string
  remainingTurns: number
  mitigated: boolean
}

export interface EventLogEntry {
  id: string
  turn: number
  type: 'info' | 'warning' | 'danger' | 'success'
  title: string
  description: string
  icon: string
}

export interface SystemState {
  energia: number
  agua: number
  saude: number
  educacao: number
  transporte: number
  seguranca: number
  economia: number
  meioAmbiente: number
  felicidade: number
  impostos: number
  obras: number
  eventos: number
}

export interface HistorySnapshot {
  turn: number
  year: number
  month: number
  money: number
  population: number
  energia: number
  agua: number
  felicidade: number
  economia: number
}

export interface GameState {
  money: number
  population: number
  housingCapacity: number
  turn: number
  speed: 0 | 1 | 2
  taxRate: number
  systems: SystemState
  tiles: TileData[]
  activeObras: ActiveObra[]
  activeEvent: ActiveEvent | null
  pendingEvent: ClimateEventDef | null
  eventLog: EventLogEntry[]
  history: HistorySnapshot[]
  isGameOver: boolean
  isVictory: boolean
  consecutiveNegativeTurns: number
  totalTaxesCollected: number
  totalEventsSurvived: number
  totalBuildingsBuilt: number
  totalBuildingsDemolished: number
}

import { GameState, SystemState, HistorySnapshot, EventLogEntry } from '@/types/game'
import {
  STRUCTURES,
  OBRAS,
  CLIMATE_EVENTS,
  WIN_POPULATION_TARGET,
  WIN_HAPPINESS_TARGET,
} from './constants'

export function calculateSystems(state: GameState): {
  systems: SystemState
  housingCap: number
  maintenanceCost: number
} {
  let energia = 40
  let agua = 40
  let saude = 40
  let educacao = 40
  let transporte = 40
  let seguranca = 40
  let economia = 40
  let meioAmbiente = 70
  let housingCap = 600
  let maintenanceCost = 0

  state.tiles.forEach((tile) => {
    if (tile.structureId) {
      const struct = STRUCTURES.find((s) => s.id === tile.structureId)
      if (struct) {
        maintenanceCost += struct.maintenance
        if (struct.housingCap) housingCap += struct.housingCap
        if (struct.effects.energia) energia += struct.effects.energia
        if (struct.effects.agua) agua += struct.effects.agua
        if (struct.effects.saude) saude += struct.effects.saude
        if (struct.effects.educacao) educacao += struct.effects.educacao
        if (struct.effects.transporte) transporte += struct.effects.transporte
        if (struct.effects.seguranca) seguranca += struct.effects.seguranca
        if (struct.effects.economia) economia += struct.effects.economia
        if (struct.effects.meioAmbiente) meioAmbiente += struct.effects.meioAmbiente
      }
    }
  })

  const popFactor = Math.floor(state.population / 400)
  energia -= popFactor * 3
  agua -= popFactor * 3
  transporte -= popFactor * 4
  seguranca -= popFactor * 2
  meioAmbiente -= popFactor * 2

  state.activeObras.forEach((activeObra) => {
    const obraDef = OBRAS.find((o) => o.id === activeObra.obraDefId)
    if (obraDef) {
      Object.entries(obraDef.disruptionEffects).forEach(([k, val]) => {
        if (k === 'transporte' && val) transporte += val
        if (k === 'economia' && val) economia += val
        if (k === 'meioAmbiente' && val) meioAmbiente += val
      })
    }
  })

  if (state.activeEvent) {
    const evtDef = CLIMATE_EVENTS.find((e) => e.id === state.activeEvent?.eventDefId)
    if (evtDef) {
      const multiplier = state.activeEvent.mitigated ? 0.3 : 1.0
      Object.entries(evtDef.penaltyEffects).forEach(([k, val]) => {
        if (!val) return
        const v = val * multiplier
        if (k === 'energia') energia += v
        if (k === 'agua') agua += v
        if (k === 'saude') saude += v
        if (k === 'transporte') transporte += v
        if (k === 'seguranca') seguranca += v
        if (k === 'economia') economia += v
        if (k === 'meioAmbiente') meioAmbiente += v
      })
    }
  }

  const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v)))

  energia = clamp(energia)
  agua = clamp(agua)
  saude = clamp(saude)
  educacao = clamp(educacao)
  transporte = clamp(transporte)
  seguranca = clamp(seguranca)
  economia = clamp(economia)
  meioAmbiente = clamp(meioAmbiente)

  let taxHappinessPenalty = 0
  if (state.taxRate > 15) {
    taxHappinessPenalty = (state.taxRate - 15) * 1.2
  } else if (state.taxRate < 15) {
    taxHappinessPenalty = -(15 - state.taxRate) * 0.5
  }

  let felicidade =
    saude * 0.2 +
    educacao * 0.15 +
    transporte * 0.15 +
    seguranca * 0.15 +
    meioAmbiente * 0.15 +
    economia * 0.2 -
    taxHappinessPenalty

  if (energia < 30) felicidade -= 15
  if (agua < 30) felicidade -= 15

  felicidade = clamp(felicidade)

  return {
    systems: {
      energia,
      agua,
      saude,
      educacao,
      transporte,
      seguranca,
      economia,
      meioAmbiente,
      felicidade,
      impostos: state.taxRate,
      obras: state.activeObras.length,
      eventos: state.systems.eventos,
    },
    housingCap,
    maintenanceCost,
  }
}

export function tickTurn(state: GameState): GameState {
  if (state.isGameOver) return state

  const nextTurn = state.turn + 1
  const currentCalculated = calculateSystems(state)
  const sys = currentCalculated.systems

  const taxRevenue = Math.round((state.taxRate / 100) * state.population * (sys.economia / 50) * 18)
  const maintenanceCost = currentCalculated.maintenanceCost
  const netIncome = taxRevenue - maintenanceCost
  const newMoney = state.money + netIncome

  let popChange = 0
  if (sys.felicidade >= 55 && state.population < currentCalculated.housingCap) {
    popChange = Math.round(15 + (sys.felicidade - 50) * 1.5 + sys.economia / 10)
  } else if (sys.felicidade < 40 || sys.saude < 30) {
    popChange = -Math.round(20 + (50 - sys.felicidade) * 2)
  }
  const newPopulation = Math.max(0, state.population + popChange)

  let consecutiveNeg = state.consecutiveNegativeTurns
  if (newMoney < -100000) {
    consecutiveNeg += 1
  } else {
    consecutiveNeg = 0
  }

  const isGameOver = newPopulation <= 0 || consecutiveNeg >= 3
  const isVictory =
    !isGameOver && newPopulation >= WIN_POPULATION_TARGET && sys.felicidade >= WIN_HAPPINESS_TARGET

  const newLogs: EventLogEntry[] = []
  const updatedObras = state.activeObras
    .map((o) => ({ ...o, remainingTurns: o.remainingTurns - 1 }))
    .filter((o) => {
      if (o.remainingTurns <= 0) {
        const obraDef = OBRAS.find((ob) => ob.id === o.obraDefId)
        newLogs.push({
          id: `obra_done_${Date.now()}_${Math.random()}`,
          turn: nextTurn,
          type: 'success',
          title: `Obra Concluída: ${obraDef?.name || 'Projeto'}`,
          description:
            'A construção foi finalizada com sucesso, trazendo grandes benefícios à cidade!',
          icon: '🏗️',
        })
        return false
      }
      return true
    })

  let activeEvent = state.activeEvent
  let totalEventsSurvived = state.totalEventsSurvived
  if (activeEvent) {
    const rem = activeEvent.remainingTurns - 1
    if (rem <= 0) {
      activeEvent = null
      totalEventsSurvived += 1
      newLogs.push({
        id: `evt_end_${Date.now()}`,
        turn: nextTurn,
        type: 'info',
        title: 'Evento Climático Encerrado',
        description: 'As condições climáticas voltaram ao normal na cidade.',
        icon: '🌈',
      })
    } else {
      activeEvent = { ...activeEvent, remainingTurns: rem }
    }
  }

  let pendingEvent = state.pendingEvent
  let turnsToNextEvent = state.systems.eventos - 1
  if (!activeEvent && !pendingEvent) {
    if (turnsToNextEvent <= 0) {
      if (Math.random() < 0.45) {
        const randEvt = CLIMATE_EVENTS[Math.floor(Math.random() * CLIMATE_EVENTS.length)]
        pendingEvent = randEvt
        turnsToNextEvent = 8 + Math.floor(Math.random() * 5)
      } else {
        turnsToNextEvent = 3
      }
    }
  }

  const year = Math.floor((nextTurn - 1) / 12) + 1
  const month = ((nextTurn - 1) % 12) + 1
  const historySnapshot: HistorySnapshot = {
    turn: nextTurn,
    year,
    month,
    money: newMoney,
    population: newPopulation,
    energia: sys.energia,
    agua: sys.agua,
    felicidade: sys.felicidade,
    economia: sys.economia,
  }

  const updatedHistory = [...state.history, historySnapshot].slice(-60)
  const updatedLogs = [...newLogs, ...state.eventLog].slice(0, 20)

  return {
    ...state,
    turn: nextTurn,
    money: newMoney,
    population: newPopulation,
    housingCapacity: currentCalculated.housingCap,
    systems: {
      ...sys,
      eventos: Math.max(0, turnsToNextEvent),
    },
    activeObras: updatedObras,
    activeEvent,
    pendingEvent,
    eventLog: updatedLogs,
    history: updatedHistory,
    isGameOver,
    isVictory,
    consecutiveNegativeTurns: consecutiveNeg,
    totalTaxesCollected: state.totalTaxesCollected + taxRevenue,
    totalEventsSurvived,
  }
}

export function placeBuilding(state: GameState, tileId: number, structureId: string): GameState {
  const struct = STRUCTURES.find((s) => s.id === structureId)
  if (!struct || state.money < struct.cost) return state

  const updatedTiles = state.tiles.map((t) => (t.id === tileId ? { ...t, structureId } : t))
  const newMoney = state.money - struct.cost

  const newLog: EventLogEntry = {
    id: `build_${Date.now()}`,
    turn: state.turn,
    type: 'info',
    title: `Construído: ${struct.name}`,
    description: `Construção concluída no lote #${tileId}.`,
    icon: struct.icon,
  }

  const nextState = {
    ...state,
    money: newMoney,
    tiles: updatedTiles,
    totalBuildingsBuilt: state.totalBuildingsBuilt + 1,
    eventLog: [newLog, ...state.eventLog].slice(0, 20),
  }

  const recalc = calculateSystems(nextState)
  return { ...nextState, systems: recalc.systems, housingCapacity: recalc.housingCap }
}

export function demolishBuilding(state: GameState, tileId: number): GameState {
  const tile = state.tiles.find((t) => t.id === tileId)
  if (!tile || !tile.structureId) return state

  const struct = STRUCTURES.find((s) => s.id === tile.structureId)
  const refund = struct ? Math.round(struct.cost * 0.5) : 0

  const updatedTiles = state.tiles.map((t) =>
    t.id === tileId ? { ...t, structureId: undefined } : t,
  )

  const newLog: EventLogEntry = {
    id: `demo_${Date.now()}`,
    turn: state.turn,
    type: 'warning',
    title: `Demolidor: ${struct?.name || 'Estrutura'}`,
    description: `Demolição concluída. Reembolsado R$ ${refund.toLocaleString('pt-BR')}.`,
    icon: '🏚️',
  }

  const nextState = {
    ...state,
    money: state.money + refund,
    tiles: updatedTiles,
    totalBuildingsDemolished: state.totalBuildingsDemolished + 1,
    eventLog: [newLog, ...state.eventLog].slice(0, 20),
  }

  const recalc = calculateSystems(nextState)
  return { ...nextState, systems: recalc.systems, housingCapacity: recalc.housingCap }
}

export function startObraAction(state: GameState, tileId: number, obraDefId: string): GameState {
  const obraDef = OBRAS.find((o) => o.id === obraDefId)
  if (!obraDef || state.money < obraDef.cost) return state

  const updatedTiles = state.tiles.map((t) => (t.id === tileId ? { ...t, obraId: obraDefId } : t))

  const newObra = {
    id: `obra_${Date.now()}`,
    obraDefId,
    tileId,
    remainingTurns: obraDef.duration,
    totalTurns: obraDef.duration,
  }

  const newLog: EventLogEntry = {
    id: `start_obra_${Date.now()}`,
    turn: state.turn,
    type: 'info',
    title: `Obra Iniciada: ${obraDef.name}`,
    description: `Previsão de conclusão em ${obraDef.duration} meses.`,
    icon: '🏗️',
  }

  const nextState = {
    ...state,
    money: state.money - obraDef.cost,
    tiles: updatedTiles,
    activeObras: [...state.activeObras, newObra],
    eventLog: [newLog, ...state.eventLog].slice(0, 20),
  }

  const recalc = calculateSystems(nextState)
  return { ...nextState, systems: recalc.systems }
}

export function resolveEventAction(state: GameState, mitigate: boolean): GameState {
  if (!state.pendingEvent) return state

  const evtDef = state.pendingEvent
  let newMoney = state.money
  let mitigated = false

  if (mitigate && state.money >= evtDef.mitigationCost) {
    newMoney -= evtDef.mitigationCost
    mitigated = true
  }

  const activeEvent = {
    eventDefId: evtDef.id,
    remainingTurns: evtDef.duration,
    mitigated,
  }

  const newLog: EventLogEntry = {
    id: `evt_start_${Date.now()}`,
    turn: state.turn,
    type: 'danger',
    title: `Evento: ${evtDef.title}`,
    description: mitigated
      ? 'Ação de mitigação ativada! Danos reduzidos em 70%.'
      : 'A cidade enfrentará o impacto total do evento climático.',
    icon: evtDef.icon,
  }

  const nextState = {
    ...state,
    money: newMoney,
    activeEvent,
    pendingEvent: null,
    eventLog: [newLog, ...state.eventLog].slice(0, 20),
  }

  const recalc = calculateSystems(nextState)
  return { ...nextState, systems: recalc.systems }
}

export function setTaxRateAction(state: GameState, newRate: number): GameState {
  const rate = Math.min(100, Math.max(0, Math.round(newRate)))
  const nextState = { ...state, taxRate: rate }
  const recalc = calculateSystems(nextState)
  return { ...nextState, systems: recalc.systems }
}

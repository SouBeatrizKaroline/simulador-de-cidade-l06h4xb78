import { StructureDef, ObraDef, ClimateEventDef, GameState } from '@/types/game'

export const GRID_COLS = 12
export const GRID_ROWS = 9
export const TOTAL_TILES = GRID_COLS * GRID_ROWS

export const INITIAL_MONEY = 250000
export const INITIAL_POPULATION = 1200
export const WIN_POPULATION_TARGET = 10000
export const WIN_HAPPINESS_TARGET = 60

export const STRUCTURES: StructureDef[] = [
  {
    id: 'res_zona',
    name: 'Zona Residencial',
    category: 'residencial',
    icon: '🏠',
    cost: 50000,
    maintenance: 500,
    housingCap: 300,
    effects: { saude: 2, meioAmbiente: -1 },
    description: 'Aumenta capacidade populacional e gera renda de impostos.',
  },
  {
    id: 'com_zona',
    name: 'Zona Comercial',
    category: 'economia',
    icon: '🏢',
    cost: 75000,
    maintenance: 1000,
    effects: { economia: 10, energia: -5, agua: -4, transporte: -3 },
    description: 'Impulsiona a economia local e os empregos.',
  },
  {
    id: 'ind_zona',
    name: 'Zona Industrial',
    category: 'economia',
    icon: '🏭',
    cost: 100000,
    maintenance: 1500,
    effects: { economia: 18, meioAmbiente: -12, energia: -10, agua: -8 },
    description: 'Forte motor econômico, mas polui e consome recursos.',
  },
  {
    id: 'ene_solar',
    name: 'Painel Solar',
    category: 'energia',
    icon: '☀️',
    cost: 40000,
    maintenance: 300,
    effects: { energia: 15, meioAmbiente: 3 },
    description: 'Energia limpa e renovável de baixo impacto.',
  },
  {
    id: 'ene_eolica',
    name: 'Turbina Eólica',
    category: 'energia',
    icon: '🌬️',
    cost: 60000,
    maintenance: 500,
    effects: { energia: 25, meioAmbiente: 5 },
    description: 'Excelente produção sustentável de energia.',
  },
  {
    id: 'ene_carvao',
    name: 'Usina a Carvão',
    category: 'energia',
    icon: '🔥',
    cost: 80000,
    maintenance: 1200,
    effects: { energia: 60, meioAmbiente: -15 },
    description: 'Alta geração de energia, porém muito poluente.',
  },
  {
    id: 'ene_nuclear',
    name: 'Usina Nuclear',
    category: 'energia',
    icon: '☢️',
    cost: 250000,
    maintenance: 4000,
    effects: { energia: 150, seguranca: -5 },
    description: 'Geração massiva de energia para grandes metrópoles.',
  },
  {
    id: 'agu_tratamento',
    name: 'Estação de Tratamento',
    category: 'agua',
    icon: '💧',
    cost: 50000,
    maintenance: 800,
    effects: { agua: 40, saude: 5 },
    description: 'Abastece a cidade com água limpa e potável.',
  },
  {
    id: 'sau_hospital',
    name: 'Hospital',
    category: 'saude',
    icon: '🏥',
    cost: 120000,
    maintenance: 2000,
    effects: { saude: 35, felicidade: 6 },
    description: 'Melhora o atendimento e a saúde pública.',
  },
  {
    id: 'edu_escola',
    name: 'Escola',
    category: 'educacao',
    icon: '🎓',
    cost: 80000,
    maintenance: 1200,
    effects: { educacao: 28, economia: 4 },
    description: 'Eleva a educação e capacitação dos cidadãos.',
  },
  {
    id: 'tra_estrada',
    name: 'Estrada Principal',
    category: 'transporte',
    icon: '🛣️',
    cost: 15000,
    maintenance: 200,
    effects: { transporte: 12 },
    description: 'Conecta bairros e facilita o tráfego urbano.',
  },
  {
    id: 'tra_metro',
    name: 'Estação de Metrô',
    category: 'transporte',
    icon: '🚇',
    cost: 180000,
    maintenance: 2500,
    effects: { transporte: 40, meioAmbiente: 5 },
    description: 'Transporte de alta capacidade e ecoeficiente.',
  },
  {
    id: 'seg_delegacia',
    name: 'Delegacia',
    category: 'seguranca',
    icon: '👮',
    cost: 70000,
    maintenance: 1000,
    effects: { seguranca: 30, felicidade: 4 },
    description: 'Mantém a ordem e reduz a criminalidade.',
  },
  {
    id: 'laz_parque',
    name: 'Parque Ecológico',
    category: 'residencial',
    icon: '🌳',
    cost: 30000,
    maintenance: 400,
    effects: { meioAmbiente: 15, felicidade: 10 },
    description: 'Área verde que limpa o ar e traz felicidade.',
  },
  {
    id: 'laz_comunitario',
    name: 'Centro Comunitário',
    category: 'residencial',
    icon: '💒',
    cost: 50000,
    maintenance: 600,
    effects: { felicidade: 12, educacao: 6 },
    description: 'Ponto de encontro social e bem-estar.',
  },
]

export const OBRAS: ObraDef[] = [
  {
    id: 'obr_barragem',
    name: 'Barragem Hidrelétrica',
    icon: '🌊',
    cost: 300000,
    duration: 6,
    disruptionEffects: { transporte: -10, meioAmbiente: -5 },
    completionEffects: { energia: 80, agua: 50 },
    description: 'Grande projeto hídrico que garante energia e água abundante.',
  },
  {
    id: 'obr_metro_exp',
    name: 'Expansão do Metrô',
    icon: '🚇',
    cost: 250000,
    duration: 5,
    disruptionEffects: { felicidade: -5, transporte: -8 },
    completionEffects: { transporte: 55, economia: 12 },
    description: 'Rede subterrânea integrada para resolver o trânsito.',
  },
  {
    id: 'obr_hospital_geral',
    name: 'Hospital Geral Metropolitano',
    icon: '🏥',
    cost: 200000,
    duration: 4,
    disruptionEffects: { economia: -5 },
    completionEffects: { saude: 55, felicidade: 12 },
    description: 'Complexo médico com UTI e especialidades de ponta.',
  },
  {
    id: 'obr_parque_central',
    name: 'Parque Ecológico Central',
    icon: '🌳',
    cost: 150000,
    duration: 3,
    disruptionEffects: { economia: -2 },
    completionEffects: { meioAmbiente: 45, felicidade: 18 },
    description: 'Pulmão verde com lagos e reservas ambientais.',
  },
]

export const CLIMATE_EVENTS: ClimateEventDef[] = [
  {
    id: 'evt_onda_calor',
    title: 'Onda de Calor Extrema',
    icon: '🌡️',
    duration: 2,
    description: 'Temperaturas elevadas aumentam o uso de ar condicionado e consumo de água.',
    penaltyEffects: { energia: -20, agua: -25, saude: -10 },
    mitigationCost: 40000,
    mitigationLabel: 'Ativar Reservas de Emergência (R$ 40.000)',
  },
  {
    id: 'evt_enchente',
    title: 'Enchente Urbana',
    icon: '🌊',
    duration: 2,
    description: 'Fortes chuvas alagam avenidas e causam caos no trânsito e comércios.',
    penaltyEffects: { transporte: -30, economia: -15, saude: -8 },
    mitigationCost: 50000,
    mitigationLabel: 'Bombear Água e Limpar Vias (R$ 50.000)',
  },
  {
    id: 'evt_seca',
    title: 'Seca Severa',
    icon: '☀️',
    duration: 3,
    description: 'Estiagem prolongada reduz os reservatórios e danifica a vegetação.',
    penaltyEffects: { agua: -40, meioAmbiente: -20 },
    mitigationCost: 60000,
    mitigationLabel: 'Contratar Caminhões-Pipa (R$ 60.000)',
  },
  {
    id: 'evt_tempestade',
    title: 'Tempestade Elétrica',
    icon: '⚡',
    duration: 1,
    description: 'Raios e ventos fortes derrubam redes de energia e danificam estruturas.',
    penaltyEffects: { energia: -35, seguranca: -15 },
    mitigationCost: 30000,
    mitigationLabel: 'Equipes de Reparo Rápido (R$ 30.000)',
  },
  {
    id: 'evt_neve',
    title: 'Onda de Frio e Neve',
    icon: '❄️',
    duration: 2,
    description: 'Geada e gelo nas pistas travam o trânsito e disparam o consumo térmico.',
    penaltyEffects: { transporte: -25, energia: -15, saude: -5 },
    mitigationCost: 35000,
    mitigationLabel: 'Espalhar Sal e Aquecimento Rápido (R$ 35.000)',
  },
]

export function createInitialTiles(): GameState['tiles'] {
  const tiles: GameState['tiles'] = []
  for (let i = 0; i < TOTAL_TILES; i++) {
    const x = i % GRID_COLS
    const y = Math.floor(i / GRID_COLS)
    tiles.push({ id: i, x, y })
  }

  const centerTiles = [
    { index: 53, struct: 'res_zona' },
    { index: 54, struct: 'res_zona' },
    { index: 55, struct: 'com_zona' },
    { index: 65, struct: 'ene_solar' },
    { index: 66, struct: 'agu_tratamento' },
    { index: 41, struct: 'tra_estrada' },
  ]

  centerTiles.forEach((item) => {
    if (tiles[item.index]) {
      tiles[item.index].structureId = item.struct
    }
  })

  return tiles
}

export const INITIAL_GAME_STATE: GameState = {
  money: INITIAL_MONEY,
  population: INITIAL_POPULATION,
  housingCapacity: 1200,
  turn: 1,
  speed: 1,
  taxRate: 15,
  systems: {
    energia: 75,
    agua: 70,
    saude: 70,
    educacao: 65,
    transporte: 70,
    seguranca: 70,
    economia: 65,
    meioAmbiente: 80,
    felicidade: 72,
    impostos: 15,
    obras: 0,
    eventos: 8,
  },
  tiles: createInitialTiles(),
  activeObras: [],
  activeEvent: null,
  pendingEvent: null,
  eventLog: [
    {
      id: 'start_1',
      turn: 1,
      type: 'info',
      title: 'Bem-vindo ao Simulador de Cidade',
      description: 'Sua gestão começou. Mantenha os 12 sistemas equilibrados e expanda!',
      icon: '🏙️',
    },
  ],
  history: [
    {
      turn: 1,
      year: 1,
      month: 1,
      money: INITIAL_MONEY,
      population: INITIAL_POPULATION,
      energia: 75,
      agua: 70,
      felicidade: 72,
      economia: 65,
    },
  ],
  isGameOver: false,
  isVictory: false,
  consecutiveNegativeTurns: 0,
  totalTaxesCollected: 0,
  totalEventsSurvived: 0,
  totalBuildingsBuilt: 6,
  totalBuildingsDemolished: 0,
}

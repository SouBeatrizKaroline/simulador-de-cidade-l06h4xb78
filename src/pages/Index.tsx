import { useState } from 'react'
import { useGame } from '@/game/GameContext'
import { CityMap } from '@/components/CityMap'
import { BuildPanel } from '@/components/BuildPanel'
import { SystemsPanel } from '@/components/SystemsPanel'
import { EventModal } from '@/components/EventModal'
import { GameEndScreen } from '@/components/GameEndScreen'
import { Map, Hammer, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

type MobileTab = 'map' | 'build' | 'systems'

const Index = () => {
  const { state } = useGame()
  const [mobileTab, setMobileTab] = useState<MobileTab>('map')

  const tabs: { key: MobileTab; label: string; icon: typeof Map }[] = [
    { key: 'map', label: 'Mapa', icon: Map },
    { key: 'build', label: 'Construir', icon: Hammer },
    { key: 'systems', label: 'Sistemas', icon: Activity },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            'h-full overflow-hidden lg:w-80 lg:flex-shrink-0',
            mobileTab === 'build' ? 'flex w-full' : 'hidden lg:flex',
          )}
        >
          <BuildPanel />
        </div>

        <div
          className={cn(
            'h-full overflow-hidden flex-1',
            mobileTab === 'map' ? 'flex' : 'hidden lg:flex',
          )}
        >
          <CityMap />
        </div>

        <div
          className={cn(
            'h-full overflow-hidden lg:w-72 lg:flex-shrink-0',
            mobileTab === 'systems' ? 'flex w-full' : 'hidden lg:flex',
          )}
        >
          <SystemsPanel />
        </div>
      </div>

      <div className="lg:hidden flex border-t border-slate-800 bg-[#0f172a]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMobileTab(tab.key)}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition',
              mobileTab === tab.key
                ? 'text-sky-400 bg-sky-950/30'
                : 'text-slate-500 hover:text-slate-300',
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <EventModal />
      <GameEndScreen />
    </div>
  )
}

export default Index

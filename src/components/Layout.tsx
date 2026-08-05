import { Outlet } from 'react-router-dom'
import { HUD } from '@/components/HUD'

export default function Layout() {
  return (
    <div className="dark flex flex-col h-screen overflow-hidden bg-[#0b1220]">
      <HUD />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

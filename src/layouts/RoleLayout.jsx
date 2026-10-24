
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'

export default function RoleLayout({ role }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const title = {
    admin: 'Admin Panel',
    user: 'Customer Portal',
    operator: 'Operator Portal',
  }[role]

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <Sidebar
        role={role}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[78px]
          items-center justify-between border-b border-slate-200
          bg-white px-4 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs text-slate-500">
                Bismi Earth Movers
              </p>
              <h2 className="font-bold text-slate-900">{title}</h2>
            </div>
          </div>

          <button
            aria-label="Notifications"
            className="rounded-xl border border-slate-200 p-2.5"
          >
            <Bell size={19} />
          </button>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
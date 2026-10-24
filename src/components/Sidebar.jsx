
import { NavLink } from 'react-router-dom'
import { Truck, X } from 'lucide-react'
import { navigation } from '../config/navigation'

export default function Sidebar({
  role,
  mobileOpen,
  onClose,
}) {
  const items = navigation[role] || []

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px]
        flex-col bg-[#0B1D2B] text-white transition-transform
        duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-[78px] items-center justify-between
          border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-yellow-400 p-2.5 text-slate-950">
              <Truck size={25} />
            </div>

            <div>
              <h1 className="font-bold">Bismi</h1>
              <p className="text-xs text-slate-400">Earth Movers</p>
            </div>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest
            text-slate-500">
            {role} menu
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {items.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === `/${role}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3
                text-sm transition ${
                  isActive
                    ? 'bg-yellow-400 font-semibold text-slate-950'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-center text-xs text-slate-500">
            Bismi Earth Movers
          </p>
        </div>
      </aside>
    </>
  )
}
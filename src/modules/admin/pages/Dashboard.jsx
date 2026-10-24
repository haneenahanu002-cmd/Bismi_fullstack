
import {
  Users,
  HardHat,
  Truck,
  CalendarDays,
  Wallet,
} from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

const stats = [
  { title: 'Total Users', value: '124', icon: Users },
  { title: 'Operators', value: '18', icon: HardHat },
  { title: 'Machines', value: '25', icon: Truck },
  { title: 'Total Bookings', value: '86', icon: CalendarDays },
]

const bookings = [
  {
    id: 'BM1025',
    customer: 'Ameen K',
    service: 'Land Clearing',
    date: '30 Sep 2026',
    status: 'Pending',
  },
  {
    id: 'BM1024',
    customer: 'Fathima P',
    service: 'JCB Excavation',
    date: '30 Sep 2026',
    status: 'Approved',
  },
  {
    id: 'BM1023',
    customer: 'Rashid K',
    service: 'Site Preparation',
    date: '29 Sep 2026',
    status: 'In Progress',
  },
]

const badgeColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-violet-100 text-violet-700',
  Completed: 'bg-emerald-100 text-emerald-700',
}

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Business Overview"
        description="Monitor bookings, machines and business operations."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2
        xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200
              bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{title}</p>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                <Icon size={21} />
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200
          bg-white p-5 xl:col-span-2">
          <h2 className="font-bold text-slate-900">Recent Bookings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest customer booking requests
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[550px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="p-3 font-semibold">{booking.id}</td>
                    <td className="p-3">{booking.customer}</td>
                    <td className="p-3">{booking.service}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2.5 py-1
                          text-xs font-semibold ${
                            badgeColors[booking.status]
                          }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-[#10253A] p-5 text-white">
          <Wallet className="text-yellow-400" size={25} />
          <h2 className="mt-4 font-bold">Payment Overview</h2>
          <p className="mt-1 text-sm text-slate-300">
            Sample outstanding payments
          </p>

          <p className="mt-5 text-3xl font-bold">₹18,500</p>
          <p className="mt-2 text-sm text-slate-300">
            Pending collection
          </p>

          <div className="mt-5 rounded-lg bg-white/10 p-3 text-sm">
            Actual totals will be loaded from the backend.
          </div>
        </div>
      </section>
    </div>
  )
}
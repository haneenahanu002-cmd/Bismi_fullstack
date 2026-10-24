import { useNavigate } from "react-router-dom";
import { User, ShieldCheck, HardHat, Truck } from "lucide-react";

export default function PortalSelector() {
  const navigate = useNavigate();

  const portals = [
    {
      title: "User",
      description: "Book services, track your work, make payments and more.",
      icon: User,
      path: "/login?role=user",
    },
    {
      title: "Admin",
      description: "Manage users, operators, machines, bookings and more.",
      icon: ShieldCheck,
      path: "/login?role=admin",
    },
    {
      title: "Operator",
      description: "View assigned jobs, update work details and create bills.",
      icon: HardHat,
      path: "/login?role=operator",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="w-full max-w-6xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">

          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-[#0B1D2B]">
              <Truck size={34} />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-[#0B1D2B] sm:text-3xl">
              Bismi Earth Movers
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Choose Your Module
            </p>
          </div>

          {/* Portals */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {portals.map((portal) => {
              const Icon = portal.icon;

              return (
                <div
                  key={portal.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 transition group-hover:bg-yellow-400 group-hover:text-[#0B1D2B]">
                    <Icon size={30} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-[#0B1D2B]">
                    {portal.title}
                  </h2>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                    {portal.description}
                  </p>

                  <button
                    onClick={() => navigate(portal.path)}
                    className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-500"
                  >
                    Login
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Bismi Earth Movers • Reliable Earth Moving Services
          </p>
        </div>
      </div>
    </div>
  );
}
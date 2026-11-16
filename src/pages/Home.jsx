
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  HardHat,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#0B1D2B]">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1D2B]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-[#0B1D2B]">
              <Truck size={22} />
            </div>

            <div className="text-left leading-tight">
              <p className="text-sm font-extrabold text-white">
                BISMI
              </p>

              <p className="text-[10px] font-medium tracking-wider text-yellow-400">
                EARTH MOVERS
              </p>
            </div>
          </button>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#home" className="text-sm text-white transition hover:text-yellow-400">
              Home
            </a>

            <a href="#services" className="text-sm text-white transition hover:text-yellow-400">
              Services
            </a>

            <a href="#machines" className="text-sm text-white transition hover:text-yellow-400">
              Machines
            </a>

            <a href="#about" className="text-sm text-white transition hover:text-yellow-400">
              About
            </a>

            <a href="#contact" className="text-sm text-white transition hover:text-yellow-400">
              Contact
            </a>
          </nav>

          {/* AUTH BUTTONS */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => navigate("/login?role=user")}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:text-yellow-400"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-[#0B1D2B] transition hover:bg-yellow-300"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-[#0B1D2B]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(250,204,21,0.18),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* HERO CONTENT */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-semibold text-yellow-400">
              <HardHat size={15} />
              RELIABLE EARTH MOVING SERVICES
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Powering Your

              <span className="block text-yellow-400">
                Projects
              </span>

              From Ground Up
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Professional JCB, excavation and earth-moving solutions
              for construction, site preparation and development projects.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                onClick={() => navigate("/login?role=user")}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-bold text-[#0B1D2B] transition hover:bg-yellow-300"
              >
                Book Now
                <ArrowRight size={18} />
              </button>

              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Learn More
              </a>

            </div>

            {/* TRUST POINTS */}
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                "Reliable Equipment",
                "Professional Service",
                "On-Time Support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-yellow-400"
                  />

                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* HERO MACHINE IMAGE */}
          <div className="relative hidden lg:block">

            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">

              {/* JCB IMAGE */}
              <div className="relative h-[410px] overflow-hidden rounded-2xl">

                <img
                  src="\public\hero-excavator.jpg"
                  alt="Bismi Earth Movers JCB Machine"
                  className="h-full w-full object-cover"
                />

                {/* IMAGE OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D2B]/70 via-transparent to-[#0B1D2B]/20" />

              </div>

              {/* MACHINE INFORMATION CARD */}
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/10 bg-[#0B1D2B]/90 p-4 backdrop-blur">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-yellow-400 p-3 text-[#0B1D2B]">
                    <HardHat size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Heavy Machines
                    </p>

                    <p className="text-xs text-slate-400">
                      Reliable Service & Support
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
              What We Do
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0B1D2B]">
              Our Services
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
              Reliable machinery solutions for different construction
              and earth-moving requirements.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Truck,
                title: "JCB Excavation",
                text: "Excavation and digging support for construction projects.",
              },
              {
                icon: Truck,
                title: "Land Clearing",
                text: "Machinery support for land preparation and clearing.",
              },
              {
                icon: HardHat,
                title: "Site Preparation",
                text: "Prepare construction sites efficiently and safely.",
              },
              {
                icon: ShieldCheck,
                title: "Earth Moving",
                text: "Reliable earth-moving and material handling solutions.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <Icon size={24} />
                </div>

                <h3 className="font-bold text-[#0B1D2B]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MACHINES ================= */}
      <section id="machines" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-8 md:grid-cols-2">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
                Our Machinery
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0B1D2B]">
                Heavy Machines.

                <span className="block text-yellow-500">
                  Ready for Work.
                </span>
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-gray-500">
                Bismi Earth Movers provides dependable machinery
                for excavation, earth moving, foundation work,
                land clearing and construction projects.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "JCB 3DX",
                  "JCB 4DX",
                  "Excavation Equipment",
                ].map((machine) => (
                  <div key={machine} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-yellow-500" />

                    <span className="text-sm font-semibold text-gray-700">
                      {machine}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#0B1D2B] p-8">
              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-white/5 p-5 text-center">
                  <Truck size={32} className="mx-auto text-yellow-400" />

                  <p className="mt-3 text-sm font-bold text-white">
                    JCB Machines
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-5 text-center">
                  <Truck size={32} className="mx-auto text-yellow-400" />

                  <p className="mt-3 text-sm font-bold text-white">
                    Excavation
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl bg-yellow-400 p-5 text-center">
                  <p className="text-2xl font-black text-[#0B1D2B]">
                    Built For Every Job
                  </p>

                  <p className="mt-1 text-sm text-[#0B1D2B]/70">
                    Professional equipment support
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="bg-gray-50 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">

          <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
            About Bismi
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0B1D2B]">
            Reliable Earth Moving Solutions
          </h2>

          <p className="mt-5 leading-7 text-gray-500">
            Bismi Earth Movers provides machinery and earth-moving
            support for construction, excavation, land preparation
            and development projects. Our goal is to provide
            reliable equipment and professional service for every job.
          </p>

        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="bg-[#0B1D2B] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">

            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Get Started
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Ready to Start Your Project?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Book a machine or contact Bismi Earth Movers for
              your construction and earth-moving requirements.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">

              <button
                onClick={() => navigate("/login?role=user")}
                className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-[#0B1D2B] hover:bg-yellow-300"
              >
                Book Now
              </button>

              <button
                onClick={() => navigate("/portal-selector")}
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:border-yellow-400 hover:text-yellow-400"
              >
                Login
              </button>

            </div>

          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-slate-500">
              © 2026 Bismi Earth Movers. All Rights Reserved.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

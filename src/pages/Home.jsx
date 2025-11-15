import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="grid gap-8 md:grid-cols-[1.4fr,1fr] items-center">
        {/* Texto */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
            tienda online · armonía.ald
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
            Fragancias para{" "}
            <span className="text-emerald-300">equilibrar</span> tus espacios.
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Sahumerios, aromatizantes y perfumes textiles seleccionados para
            crear ambientes cálidos, limpios y llenos de buenas energías. 
            Inspirado en marcas como Sagrada Madre y Saphirus.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/sahumerios"
              className="px-4 py-2 rounded-full bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition-all"
            >
              Ver sahumerios
            </Link>

            <Link
              to="/aromatizantes"
              className="px-4 py-2 rounded-full border border-emerald-400/70 text-emerald-200 text-sm hover:bg-emerald-400/10 transition-all"
            >
              Aromatizantes
            </Link>

            <Link
              to="/textil"
              className="px-4 py-2 rounded-full border border-slate-600 text-slate-200 text-xs hover:bg-slate-900 transition-all"
            >
              Perfume textil
            </Link>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 pt-3 text-[11px] text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700">
              Sahumerios Sagrada Madre
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700">
              Aromatizantes tipo Saphirus
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700">
              Perfume textil para ropa
            </span>
          </div>
        </div>

        {/* “Imagen” / panel visual */}
        <div className="relative">
          <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-br from-emerald-400/20 via-slate-900 to-slate-950 border border-emerald-400/40 shadow-2xl shadow-emerald-500/20 p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-xs text-emerald-200/90">
                Ritual de calma · Armonía.ald
              </p>
              <p className="text-sm text-slate-100">
                Encendé un sahumerio, cerrá los ojos y dejá que el aroma haga el resto.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-2">
                <p className="text-emerald-300 font-medium">Sahumerios</p>
                <p className="text-slate-400">Limpieza y protección.</p>
              </div>
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-2">
                <p className="text-emerald-300 font-medium">Aromatizantes</p>
                <p className="text-slate-400">Ambientes perfumados.</p>
              </div>
              <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-2">
                <p className="text-emerald-300 font-medium">Textil</p>
                <p className="text-slate-400">Ropa siempre fresca.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-emerald-200">
          Explorá por categoría
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/sahumerios"
            className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-emerald-400/50 hover:-translate-y-[2px] transition-all"
          >
            <p className="text-sm font-medium text-emerald-200 mb-1">
              Sahumerios 🌿
            </p>
            <p className="text-xs text-slate-400">
              Varillas, conos y mezclas para limpieza energética y rituales.
            </p>
            <p className="mt-2 text-[11px] text-emerald-300 group-hover:underline">
              Ver sahumerios
            </p>
          </Link>

          <Link
            to="/aromatizantes"
            className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-emerald-400/50 hover:-translate-y-[2px] transition-all"
          >
            <p className="text-sm font-medium text-emerald-200 mb-1">
              Aromatizantes 🌬️
            </p>
            <p className="text-xs text-slate-400">
              Sprays para auto, hogar y negocio. Aromas intensos y duraderos.
            </p>
            <p className="mt-2 text-[11px] text-emerald-300 group-hover:underline">
              Ver aromatizantes
            </p>
          </Link>

          <Link
            to="/textil"
            className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-emerald-400/50 hover:-translate-y-[2px] transition-all"
          >
            <p className="text-sm font-medium text-emerald-200 mb-1">
              Perfume textil 👕
            </p>
            <p className="text-xs text-slate-400">
              Fragancias suaves para sábanas, cortinas y ropa del día a día.
            </p>
            <p className="mt-2 text-[11px] text-emerald-300 group-hover:underline">
              Ver perfumes textiles
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

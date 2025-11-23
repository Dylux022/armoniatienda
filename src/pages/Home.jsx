import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="grid gap-8 md:grid-cols-[1.4fr,1fr] items-center">
        {/* Texto */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-600/80">
            tienda online · armonía.ald
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-slate-900">
            Fragancias para{" "}
            <span className="text-emerald-600">equilibrar</span> tus espacios.
          </h1>

          <p className="text-slate-700 text-sm md:text-base max-w-xl">
            Sahumerios, aromatizantes y perfumes textiles seleccionados para
            crear ambientes cálidos, limpios y llenos de buenas energías. 
            Inspirado en marcas como Sagrada Madre y Saphirus.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/sahumerios"
              className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 active:scale-95 transition-all shadow-sm"
            >
              Ver sahumerios
            </Link>

            <Link
              to="/aromatizantes"
              className="px-4 py-2 rounded-full border border-emerald-400 text-emerald-700 text-sm hover:bg-emerald-50 transition-all"
            >
              Aromatizantes
            </Link>

            <Link
              to="/textil"
              className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 transition-all"
            >
              Perfume textil
            </Link>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 pt-3 text-[11px] text-slate-600">
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
              Sahumerios Sagrada Madre
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
              Aromatizantes tipo Saphirus
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
              Perfume textil para ropa
            </span>
          </div>
        </div>

        {/* Panel visual */}
        <div className="relative">
          <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-br from-emerald-50 via-emerald-100/60 to-emerald-50 border border-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-xs text-emerald-700/90">
                Ritual de calma · Armonía.ald
              </p>
              <p className="text-sm text-slate-800">
                Encendé un sahumerio, respirá profundo y dejá que el aroma haga el resto.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="bg-white/90 rounded-2xl border border-emerald-50 p-2 shadow-sm">
                <p className="text-emerald-700 font-medium">Sahumerios</p>
                <p className="text-slate-600">Limpieza y protección.</p>
              </div>
              <div className="bg-white/90 rounded-2xl border border-emerald-50 p-2 shadow-sm">
                <p className="text-emerald-700 font-medium">Aromatizantes</p>
                <p className="text-slate-600">Ambientes perfumados.</p>
              </div>
              <div className="bg-white/90 rounded-2xl border border-emerald-50 p-2 shadow-sm">
                <p className="text-emerald-700 font-medium">Textil</p>
                <p className="text-slate-600">Ropa siempre fresca.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      <section className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">
          Explorá por categoría
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/sahumerios"
            className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all"
          >
            <p className="text-sm font-medium text-emerald-700 mb-1">
              Sahumerios 🌿
            </p>
            <p className="text-xs text-slate-600">
              Varillas, conos y mezclas para limpieza energética y rituales.
            </p>
            <p className="mt-2 text-[11px] text-emerald-600 group-hover:underline">
              Ver sahumerios
            </p>
          </Link>

          <Link
            to="/aromatizantes"
            className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all"
          >
            <p className="text-sm font-medium text-emerald-700 mb-1">
              Aromatizantes 🌬️
            </p>
            <p className="text-xs text-slate-600">
              Sprays para auto, hogar y negocio. Aromas intensos y duraderos.
            </p>
            <p className="mt-2 text-[11px] text-emerald-600 group-hover:underline">
              Ver aromatizantes
            </p>
          </Link>

          <Link
            to="/textil"
            className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all"
          >
            <p className="text-sm font-medium text-emerald-700 mb-1">
              Perfume textil 👕
            </p>
            <p className="text-xs text-slate-600">
              Fragancias suaves para sábanas, cortinas y ropa del día a día.
            </p>
            <p className="mt-2 text-[11px] text-emerald-600 group-hover:underline">
              Ver perfumes textiles
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

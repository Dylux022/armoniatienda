import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* HERO CENTRADO */}
      <section className="text-center space-y-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-600/80">
          Armonía.ALD · Tienda online
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-snug">
          Aromas para hacer{" "}
          <span className="text-emerald-600">tu espacio</span>
          <br className="hidden sm:block" /> un lugar más liviano.
        </h1>

        <p className="max-w-xl mx-auto text-sm md:text-base text-slate-600">
          Sahumerios, aromatizantes y perfumes textiles pensados para limpiar,
          equilibrar y acompañar tus momentos de descanso, trabajo o ritual.
        </p>

        {/* CTA PRINCIPAL */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <Link
            to="/catalogo"
            className="px-6 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
          >
            Ver catálogo
          </Link>

          {/* CATEGORÍAS SECUNDARIAS (más visibles, pero no más fuertes que el CTA) */}
          <div className="flex flex-wrap justify-center gap-2 text-[11px]">
            <Link
              to="/sahumerios"
              className="px-3 py-1 rounded-full border border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              Sahumerios
            </Link>
            <Link
              to="/aromatizantes"
              className="px-3 py-1 rounded-full border border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              Aromatizantes
            </Link>
            <Link
              to="/textil"
              className="px-3 py-1 rounded-full border border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              Perfume textil
            </Link>
          </div>
        </div>
      </section>

      {/* BLOQUE VISUAL / CLIMA DE MARCA */}
      <section className="grid gap-6 md:grid-cols-[1.3fr,1fr] items-stretch">
        {/* Texto “sensación” */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-emerald-700">
              Tu pequeño ritual diario
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Un sahumerio después de limpiar, un aromatizante en el living,
              perfume textil en la ropa de cama. Pequeños gestos que cambian
              cómo se siente tu casa.
            </p>
          </div>

          <ul className="text-xs text-slate-600 space-y-1.5">
            <li>• Aromas inspirados en marcas como Sagrada Madre y Saphirus.</li>
            <li>• Opción de elegir aroma en cada producto.</li>
            <li>• Coordinamos pago y entrega por WhatsApp, de forma simple.</li>
          </ul>
        </div>

        {/* Tarjeta “foto” estilizada */}
        <div className="relative">
          <div className="h-full min-h-[190px] rounded-3xl bg-gradient-to-br from-emerald-50 via-emerald-100/80 to-emerald-50 border border-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-[11px] text-emerald-700/90">
                Mood · calma / limpieza / orden
              </p>
              <p className="text-sm text-slate-800">
                Pensado para esos momentos en los que querés que tu casa se
                sienta liviana y en armonía.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] mt-3">
              <div className="bg-white/95 rounded-2xl border border-emerald-50 p-2 shadow-sm">
                <p className="text-emerald-700 font-medium">Sahumerios</p>
                <p className="text-slate-600">Limpieza energética.</p>
              </div>
              <div className="bg-white/95 rounded-2xl border border-emerald-50 p-2 shadow-sm">
                <p className="text-emerald-700 font-medium">Aromatizantes</p>
                <p className="text-slate-600">Ambientes perfumados.</p>
              </div>
              <div className="bg-white/95 rounded-2xl border border-emerald-50 p-2 shadow-sm">
                <p className="text-emerald-700 font-medium">Textil</p>
                <p className="text-slate-600">Ropa y telas frescas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO COMPRAR */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          ¿Cómo comprar en Armonía.ALD?
        </h2>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid gap-4 md:grid-cols-3 text-xs text-slate-600">
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">1. Elegís</p>
            <p>
              Navegás por el catálogo, elegís tus aromas favoritos y los agregás al carrito.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">2. Confirmás</p>
            <p>
              Completás tus datos en el checkout. Te mostramos un resumen con el
              total estimado.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">3. Coordinamos</p>
            <p>
              Te contactamos por WhatsApp para coordinar pago, punto de entrega
              o envío a domicilio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

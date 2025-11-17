import React from "react";
import { useLocation, Link } from "react-router-dom";

function PedidoEnviado() {
  const location = useLocation();
  const state = location.state || {};
  const nombre = state.nombre;
  const total = state.total;

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <div className="space-y-3">
        <p className="text-4xl">✨</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-emerald-300">
          ¡Pedido enviado con éxito!
        </h2>

        <p className="text-sm md:text-base text-slate-300">
          {nombre ? (
            <>
              Gracias, <span className="text-emerald-300 font-medium">{nombre}</span>. 
              Recibimos tu pedido y en breve nos vamos a contactar por WhatsApp
              para coordinar el pago y la entrega.
            </>
          ) : (
            <>
              Recibimos tu pedido y en breve nos vamos a contactar por WhatsApp
              para coordinar el pago y la entrega.
            </>
          )}
        </p>
      </div>

      {/* Resumen simple */}
      {typeof total === "number" && total > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-3 inline-block text-left">
          <p className="text-xs text-slate-400 mb-1">Resumen</p>
          <p className="text-sm text-slate-300">
            Total del pedido:{" "}
            <span className="text-emerald-300 font-semibold">${total}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Si hay alguna diferencia, la ajustamos al momento de coordinar el pago.
          </p>
        </div>
      )}

      <div className="space-y-2 text-xs text-slate-500">
        <p>
          Si no te escribimos en un rato, podés enviarnos tu comprobante o consulta 
          por WhatsApp usando el número habitual de contacto.
        </p>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          to="/"
          className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition-all"
        >
          Volver al inicio
        </Link>

        <Link
          to="/sahumerios"
          className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-slate-600 text-slate-200 text-sm hover:bg-slate-900 transition-all"
        >
          Ver más productos
        </Link>
      </div>
    </div>
  );
}

export default PedidoEnviado;

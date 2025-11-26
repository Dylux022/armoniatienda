import React from "react";
import { useLocation, Link } from "react-router-dom";

function PedidoEnviado() {
  const location = useLocation();
  const state = location.state || {};
  const nombre = state.nombre;
  const total = state.total;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-emerald-100 rounded-3xl px-6 py-8 shadow-sm text-center space-y-6">
        {/* Icono / Header */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            ¡Pedido enviado con éxito!
          </h2>

          <p className="text-sm md:text-base text-slate-600">
            {nombre ? (
              <>
                Gracias,{" "}
                <span className="text-emerald-700 font-medium">
                  {nombre}
                </span>
                . Recibimos tu pedido y en breve nos vamos a contactar por
                WhatsApp para coordinar el pago y la entrega.
              </>
            ) : (
              <>
                Recibimos tu pedido y en breve nos vamos a contactar por
                WhatsApp para coordinar el pago y la entrega.
              </>
            )}
          </p>
        </div>

        {/* Resumen simple */}
        {typeof total === "number" && total > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 inline-block text-left">
            <p className="text-xs text-emerald-700/80 mb-1">Resumen</p>
            <p className="text-sm text-slate-800">
              Total del pedido:{" "}
              <span className="text-emerald-700 font-semibold">
                ${total}
              </span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Si hay alguna diferencia, la ajustamos al momento de coordinar el
              pago.
            </p>
          </div>
        )}

        {/* Texto aclaratorio */}
        <div className="space-y-2 text-xs text-slate-500 max-w-lg mx-auto">
          <p>
            Si no te escribimos en un rato, podés enviarnos tu comprobante o
            consulta por WhatsApp usando el número habitual de contacto.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
          >
            Volver al inicio
          </Link>

          <Link
            to="/sahumerios"
            className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 transition-all"
          >
            Ver más productos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PedidoEnviado;

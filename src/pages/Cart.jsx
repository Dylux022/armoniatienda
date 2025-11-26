import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, onRemoveItem, onUpdateItemQuantity }) {
  const total = cart.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 1),
    0
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">
        Carrito de compras 🛒
      </h2>

      {cart.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-600">
            Todavía no agregaste productos. Andá al catálogo y sumá algo lindo ✨
          </p>
          <div className="mt-3">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
            >
              Ver productos
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.categoria}-${item.aromaSeleccionado || "na"}`}
                className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm"
              >
                {/* Info del producto */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {item.nombre}
                  </p>

                  {item.aromaSeleccionado && (
                    <p className="text-[11px] text-emerald-700">
                      Aroma:{" "}
                      <span className="font-medium">
                        {item.aromaSeleccionado}
                      </span>
                    </p>
                  )}

                  <p className="text-xs text-slate-500">
                    ${item.precio} c/u
                  </p>

                  {item.stock != null && (
                    <p className="text-[11px] text-slate-500">
                      Stock disponible: {item.stock}
                    </p>
                  )}
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition-all"
                    onClick={() =>
                      onUpdateItemQuantity(item.id, item.categoria, -1)
                    }
                  >
                    −
                  </button>

                  <span className="min-w-[2rem] text-center text-sm text-slate-900">
                    x{item.cantidad}
                  </span>

                  <button
                    className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition-all"
                    onClick={() =>
                      onUpdateItemQuantity(item.id, item.categoria, +1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* Subtotal + botón quitar */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-700">
                    ${item.precio * item.cantidad}
                  </p>
                  <button
                    className="mt-1 text-[11px] px-2 py-1 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 transition-all"
                    onClick={() => onRemoveItem(item.id, item.categoria)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total + botones abajo */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-4">
            <div className="flex gap-2">
              <button
                className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
                onClick={() => {
                  onRemoveItem("all");
                }}
              >
                Vaciar carrito
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-xl font-semibold text-emerald-700 text-right">
                Total: ${total}
              </p>

              <Link
                to="/checkout"
                className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all text-center"
              >
                Finalizar compra
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

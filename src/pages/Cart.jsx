import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, onRemoveItem, onUpdateItemQuantity }) {
  const total = cart.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 1),
    0
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Carrito de compras 🛒
      </h2>

      {cart.length === 0 ? (
        <p className="text-slate-400">
          Todavía no agregaste productos. Andá al catálogo y sumá algo lindo ✨
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.categoria}`}
                className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-emerald-200">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-slate-400">
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
                    className="w-7 h-7 rounded-full border border-slate-600 text-slate-200 text-sm hover:bg-slate-800 transition-all"
                    onClick={() =>
                      onUpdateItemQuantity(item.id, item.categoria, -1)
                    }
                  >
                    −
                  </button>

                  <span className="min-w-[2rem] text-center text-sm text-slate-100">
                    x{item.cantidad}
                  </span>

                  <button
                    className="w-7 h-7 rounded-full border border-slate-600 text-slate-200 text-sm hover:bg-slate-800 transition-all"
                    onClick={() =>
                      onUpdateItemQuantity(item.id, item.categoria, +1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* Subtotal + botón quitar */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-300">
                    ${item.precio * item.cantidad}
                  </p>
                  <button
                    className="mt-1 text-[11px] px-2 py-1 rounded-full border border-red-400/70 text-red-300 hover:bg-red-400/10 transition-all"
                    onClick={() => onRemoveItem(item.id, item.categoria)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total + botones abajo */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-800 pt-4">
            <div className="flex gap-2">
              <button
                className="text-xs px-3 py-1 rounded-full border border-slate-500 text-slate-300 hover:bg-slate-800 transition-all"
                onClick={() => {
                  onRemoveItem("all");
                }}
              >
                Vaciar carrito
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-xl font-semibold text-emerald-300 text-right">
                Total: ${total}
              </p>

              <Link
                to="/checkout"
                className="px-4 py-2 rounded-full bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition-all text-center"
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

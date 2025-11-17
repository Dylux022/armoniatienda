import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, onRemoveItem }) {
  const total = cart.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Carrito de compras 🛒
      </h2>

      {cart.length === 0 ? (
        <p className="text-slate-400">
          Todavía no agregaste productos. Andá a la sección de sahumerios y sumá algo lindo ✨
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-medium text-emerald-200">{item.nombre}</p>
                  <p className="text-sm text-slate-400">
                    ${item.precio}
                  </p>
                </div>

                <button
                  className="text-xs px-3 py-1 rounded-full border border-red-400/70 text-red-300 hover:bg-red-400/10 transition-all"
                  onClick={() => onRemoveItem(index)}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              className="text-xs px-3 py-1 rounded-full border border-slate-500 text-slate-300 hover:bg-slate-800 transition-all"
              onClick={() => {
                onRemoveItem("all");
              }}
            >
              Vaciar carrito
            </button>

            <p className="text-xl font-semibold text-emerald-300">
              ${total}
            </p>
          </div>

          {/* 🔥 BOTÓN FINALIZAR COMPRA */}
          <Link
            to="/checkout"
            className="block w-full text-center mt-4 py-2 bg-emerald-400 text-slate-950 rounded-full hover:bg-emerald-300 transition-all"
          >
            Finalizar compra
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;

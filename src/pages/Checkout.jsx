import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, onClearCart }) {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [entrega, setEntrega] = useState("retiro");
  const [estadoMensaje, setEstadoMensaje] = useState(null);

  const total = cart.reduce((acc, item) => acc + item.precio, 0);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setEstadoMensaje(null);

    if (!nombre || !telefono) {
      setEstadoMensaje({
        tipo: "error",
        mensaje: "Completá nombre y teléfono."
      });
      return;
    }

    try {
      await addDoc(collection(db, "pedidos"), {
        items: cart,
        total,
        fecha: new Date().toISOString(),
        nombreCliente: nombre,
        telefono,
        metodoPago,
        entrega,
        estado: "pendiente"
      });

      onClearCart();
      navigate("/pedido-enviado");
    } catch (err) {
      console.error("Error guardando pedido:", err);
      setEstadoMensaje({
        tipo: "error",
        mensaje: "No se pudo enviar el pedido."
      });
    }
  };

  if (cart.length === 0) {
    return <p className="text-slate-300">El carrito está vacío.</p>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Finalizar compra 🧾
      </h2>

      <form
        onSubmit={handleConfirmar}
        className="space-y-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl"
      >
        <div>
          <label className="text-sm">Nombre</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Teléfono</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Método de pago</label>
          <select
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="transferencia">Transferencia bancaria</option>
            <option value="efectivo">Efectivo</option>
            <option value="contraentrega">Contraentrega</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Forma de entrega</label>
          <select
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-slate-100"
            value={entrega}
            onChange={(e) => setEntrega(e.target.value)}
          >
            <option value="retiro">Retiro en el local</option>
            <option value="domicilio">Envío a domicilio</option>
          </select>
        </div>

        <div className="border-t border-slate-700 pt-3">
          <p className="text-emerald-300 font-semibold text-lg">
            Total: ${total}
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-emerald-400 text-slate-950 rounded-full hover:bg-emerald-300 transition-all"
        >
          Confirmar pedido
        </button>

        {estadoMensaje && (
          <p
            className={`text-sm mt-2 ${
              estadoMensaje.tipo === "error"
                ? "text-red-300"
                : "text-emerald-300"
            }`}
          >
            {estadoMensaje.mensaje}
          </p>
        )}
      </form>
    </div>
  );
}

export default Checkout;

import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ADMIN_EMAIL = "ellautysk8@gmail.com";
const ADMIN_WHATSAPP = "5491130560849"; // ← tu número

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Verificar sesión admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  // Cargar pedidos
  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const snap = await getDocs(collection(db, "pedidos"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setPedidos(data);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      }
    };

    if (user?.email === ADMIN_EMAIL) cargarPedidos();
  }, [user]);

  // Actualizar estado
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "pedidos", id), { estado: nuevoEstado });

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estado: nuevoEstado } : p
        )
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  // Formatear mensaje WhatsApp
  const generarMensaje = (p) => {
    const fechaFormateada = p.fecha
      ? new Date(p.fecha).toLocaleString()
      : "—";

    const productosTexto = p.items
      ?.map((i) => `• ${i.nombre} — $${i.precio}`)
      .join("\n");

    return `
Nuevo pedido para Armonía.ALD 💚

Cliente: ${p.nombreCliente || "—"}
Teléfono: ${p.telefono || "—"}
Método de pago: ${p.metodoPago || "—"}
Entrega: ${p.entrega || "—"}

Productos:
${productosTexto}

Total: $${p.total}
Estado: ${p.estado}

Fecha: ${fechaFormateada}
ID del pedido: ${p.id}
    `;
  };

  // Enviar a WhatsApp
  const enviarWhatsapp = (pedido) => {
    const mensaje = encodeURIComponent(generarMensaje(pedido));
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${mensaje}`;
    window.open(url, "_blank");
  };

  // Vistas de permisos
  if (loadingAuth) return <p className="text-slate-300">Verificando sesión...</p>;
  if (!user) return <p className="text-red-300">Tenés que iniciar sesión.</p>;
  if (user.email !== ADMIN_EMAIL)
    return <p className="text-red-300">No tenés permisos para ver pedidos.</p>;

  // Vista principal
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Pedidos recibidos 🧾
      </h2>

      {pedidos.length === 0 ? (
        <p className="text-slate-400">Todavía no hay pedidos.</p>
      ) : (
        pedidos.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-2"
          >
            <p className="text-[11px] text-slate-500">
              <strong>ID:</strong> {p.id}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Fecha:</strong>{" "}
              {p.fecha ? new Date(p.fecha).toLocaleString() : "—"}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Cliente:</strong>{" "}
              <span className="text-emerald-300">{p.nombreCliente}</span>
            </p>

            <p className="text-sm text-slate-300">
              <strong>Teléfono:</strong> {p.telefono}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Método pago:</strong> {p.metodoPago}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Entrega:</strong> {p.entrega}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Total:</strong>{" "}
              <span className="text-emerald-300">${p.total}</span>
            </p>

            {/* SELECT DE ESTADO */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-300"><strong>Estado:</strong></p>
              <select
                value={p.estado}
                onChange={(e) =>
                  actualizarEstado(p.id, e.target.value)
                }
                className="text-xs bg-slate-800 border border-slate-600 rounded-full px-2 py-1 text-slate-200"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-200">Productos:</p>
              <ul className="list-disc ml-5 text-[13px] text-slate-400">
                {p.items?.map((i, idx) => (
                  <li key={idx}>{i.nombre} — ${i.precio}</li>
                ))}
              </ul>
            </div>

            {/* 🔥 BOTÓN WHATSAPP */}
            <button
              onClick={() => enviarWhatsapp(p)}
              className="mt-3 w-full bg-green-500/90 hover:bg-green-400 text-slate-900 font-medium py-1.5 rounded-full transition-all text-sm"
            >
              Enviar por WhatsApp
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPedidos;

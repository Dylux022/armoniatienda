import React, { useEffect, useState } from "react";
import { db, auth, googleProvider } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Link } from "react-router-dom";

// 🔑 API key de ImgBB (ideal: pasarla a .env)
const IMGBB_API_KEY = "8aabe783868094ca8afb31264c5eb457";

// MISMO LISTADO DE ADMINS QUE EN AdminPedidos.jsx
const ADMIN_EMAILS = [
  "dylanc021684@gmail.com",
  "thagostina@gmail.com",
   "armonia.ald@gmail.com",
  "ellautysk8@gmail.com",
];

const Admin = () => {
  const [categoria, setCategoria] = useState("sahumerios");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [aromasTexto, setAromasTexto] = useState(""); // 🔹 "Lavanda, Vainilla"

  const [estado, setEstado] = useState(null);

  const [user, setUser] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [errorAuth, setErrorAuth] = useState(null);

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [stock, setStock] = useState(0);

  // ID del producto que se está editando (si es null, estamos creando uno nuevo)
  const [editandoId, setEditandoId] = useState(null);

  // Escuchar estado de autenticación
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (userFb) => {
      setUser(userFb);
      setCargandoAuth(false);
    });

    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setErrorAuth(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setErrorAuth("No se pudo iniciar sesión.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagen("");
    setImagenFile(null);
    setStock(0);
    setAromasTexto("");
    setEditandoId(null);
    setEstado(null);
  };

  // Cargar productos de la categoría actual
  const cargarProductos = async (cat) => {
    setCargandoProductos(true);
    try {
      const snap = await getDocs(collection(db, cat));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setCargandoProductos(false);
    }
  };

  // Cada vez que haya un admin logueado y cambie la categoría, cargamos productos
  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      cargarProductos(categoria);
    }
  }, [user, categoria]);

  // 👇 Subir imagen a ImgBB
  const subirImagenAImgBB = async (file) => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Respuesta ImgBB:", data);
        throw new Error("Error al subir la imagen a ImgBB");
      }

      // URL pública de la imagen
      return data.data.url;
    } catch (error) {
      console.error("Error ImgBB:", error);
      setEstado({
        tipo: "error",
        mensaje: "No se pudo subir la imagen (ImgBB).",
      });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado(null);

    // 🔎 Validaciones básicas
    if (!nombre || !descripcion || !precio) {
      setEstado({
        tipo: "error",
        mensaje: "Completá nombre, descripción y precio.",
      });
      return;
    }

    const precioNumber = Number(precio);
    if (isNaN(precioNumber) || precioNumber <= 0) {
      setEstado({
        tipo: "error",
        mensaje: "El precio debe ser un número válido mayor a 0.",
      });
      return;
    }

    // Queremos al menos URL o archivo
    if (!imagen && !imagenFile) {
      setEstado({
        tipo: "error",
        mensaje: "Cargá una URL de imagen o subí un archivo.",
      });
      return;
    }

    try {
      // 🖼 URL final de la imagen que vamos a guardar en Firestore
      let imagenURLFinal = imagen || "";

      // Si hay archivo seleccionado, lo subimos a ImgBB
      if (imagenFile) {
        const urlSubida = await subirImagenAImgBB(imagenFile);
        if (!urlSubida) {
          // Ya se seteo el estado de error adentro
          return;
        }
        imagenURLFinal = urlSubida;
      }

      // 🧴 Aromas: se guardan como array de strings
      const aromasArray = aromasTexto
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const data = {
        nombre,
        descripcion,
        precio: precioNumber,
        imagen: imagenURLFinal,
        stock,
        ...(aromasArray.length > 0 && { aromas: aromasArray }),
      };

      if (editandoId) {
        // 🔁 Modo edición: actualizar producto existente
        const refDoc = doc(db, categoria, editandoId);
        await updateDoc(refDoc, data);

        setEstado({
          tipo: "ok",
          mensaje: "Producto actualizado correctamente.",
        });
      } else {
        // ➕ Modo creación: nuevo producto
        const colRef = collection(db, categoria);
        await addDoc(colRef, data);

        setEstado({
          tipo: "ok",
          mensaje: "Producto cargado correctamente.",
        });
      }

      limpiarFormulario();
      cargarProductos(categoria);
    } catch (err) {
      console.error("Error guardando producto:", err);
      setEstado({
        tipo: "error",
        mensaje: "No se pudo guardar el producto.",
      });
    }
  };

  const handleEditarProducto = (producto) => {
    setNombre(producto.nombre || "");
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio != null ? String(producto.precio) : "");
    setImagen(producto.imagen || "");
    setImagenFile(null);
    setStock(producto.stock != null ? producto.stock : 0);
    setAromasTexto(
      Array.isArray(producto.aromas) ? producto.aromas.join(", ") : ""
    );
    setEditandoId(producto.id);
    setEstado({
      tipo: "info",
      mensaje: `Editando: ${producto.nombre}`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔥 Eliminar producto
  const handleEliminarProducto = async (producto) => {
    const confirmar = window.confirm(
      `¿Eliminar "${producto.nombre}" de ${categoria}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, categoria, producto.id));

      setEstado({
        tipo: "ok",
        mensaje: "Producto eliminado correctamente.",
      });

      if (editandoId === producto.id) {
        limpiarFormulario();
      }

      cargarProductos(categoria);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      setEstado({
        tipo: "error",
        mensaje: "No se pudo eliminar el producto.",
      });
    }
  };

  // 1) Mientras chequea si estás logueado
  if (cargandoAuth) {
    return (
      <div className="max-w-md mx-auto">
        <p className="text-sm text-slate-600 bg-white rounded-2xl px-4 py-3 shadow-sm">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // 2) Si no hay usuario logueado → pedir login
  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <div className="space-y-4 bg-white rounded-3xl shadow-sm border border-slate-200 px-6 py-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Acceso al panel de administración
          </h2>
          <p className="text-sm text-slate-600">
            Esta sección es sólo para administración de{" "}
            <span className="font-medium">Armonía.ALD</span>. Iniciá sesión con
            tu cuenta de Google para continuar.
          </p>

          <button
            onClick={handleLogin}
            className="w-full px-4 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
          >
            Iniciar sesión con Google
          </button>

          {errorAuth && (
            <p className="text-xs text-red-500 mt-1 bg-red-50 rounded-xl px-3 py-2">
              {errorAuth}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3) Si hay usuario pero NO está en la lista de admins
  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="max-w-md mx-auto">
        <div className="space-y-4 bg-white rounded-3xl shadow-sm border border-amber-200 px-6 py-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Sin permisos
          </h2>
          <p className="text-sm text-slate-600">
            Estás logueado como{" "}
            <span className="font-medium text-slate-900">{user.email}</span>, 
            pero esta cuenta no tiene acceso de administración.
          </p>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-full border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 transition-all"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // 4) Si es un admin válido → mostrar formulario + listado de productos
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Panel de productos
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Logueado como{" "}
            <span className="font-medium text-slate-900">{user.email}</span>
          </p>

          <Link
            to="/admin/pedidos"
            className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium mt-2"
          >
            Ver pedidos
            <span aria-hidden>→</span>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-3 py-2 rounded-full border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 transition-all"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="text-sm text-slate-600">
        Desde acá podés cargar productos o editar los existentes en las colecciones:
        <span className="font-medium"> sahumerios, aromatizantes y textil</span>.
      </p>

      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-start">
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm"
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Categoría
            </label>
            <select
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={categoria}
              onChange={(e) => {
                const nuevaCat = e.target.value;
                setCategoria(nuevaCat);
                limpiarFormulario();
                setEstado(null);
              }}
            >
              <option value="sahumerios">Sahumerios</option>
              <option value="aromatizantes">Aromatizantes</option>
              <option value="textil">Perfume textil</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 min-h-[70px] focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Precio
              </label>
              <input
                type="number"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Ej: 10"
                required
              />
            </div>
          </div>

          {/* Aromas */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Aromas (separar con coma)
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Ej: Lavanda, Vainilla, Coco"
              value={aromasTexto}
              onChange={(e) => setAromasTexto(e.target.value)}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Estos aromas se pueden usar después para que el cliente elija uno
              al hacer el pedido.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              URL de la imagen
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Podés pegar una URL directa o subir un archivo desde tu dispositivo.
            </p>
          </div>

          {/* IMAGEN (ARCHIVO) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Subir imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-700"
            />
            <p className="text-[11px] text-slate-500">
              Si hay URL y archivo, se usará la imagen subida.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
            >
              {editandoId ? "Guardar cambios" : "Guardar producto"}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="px-4 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 transition-all"
              >
                Cancelar edición
              </button>
            )}
          </div>

          {estado && (
            <p
              className={`text-xs mt-2 rounded-xl px-3 py-2 ${
                estado.tipo === "ok"
                  ? "bg-emerald-50 text-emerald-700"
                  : estado.tipo === "info"
                  ? "bg-sky-50 text-sky-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {estado.mensaje}
            </p>
          )}
        </form>

        {/* Listado de productos de la categoría */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Productos en {categoria}
          </h3>

          {cargandoProductos ? (
            <p className="text-slate-600 text-sm bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
              Cargando productos...
            </p>
          ) : productos.length === 0 ? (
            <p className="text-slate-600 text-sm bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
              No hay productos cargados en esta categoría.
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-auto pr-1">
              {productos.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm"
                >
                  {p.imagen && (
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 hidden xs:block"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {p.nombre}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {p.descripcion}
                    </p>
                    <p className="text-sm text-emerald-700 mt-1 font-semibold">
                      ${p.precio}
                    </p>
                    {typeof p.stock === "number" && (
                      <p className="text-[11px] text-slate-500">
                        Stock: {p.stock}
                      </p>
                    )}

                    {Array.isArray(p.aromas) && p.aromas.length > 0 && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Aromas:{" "}
                        <span className="text-slate-700">
                          {p.aromas.join(" · ")}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditarProducto(p)}
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-400 text-emerald-700 hover:bg-emerald-50 transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarProducto(p)}
                      className="text-xs px-3 py-1.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;

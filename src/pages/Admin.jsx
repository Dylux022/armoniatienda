import React, { useEffect, useState } from "react";
import { db, auth, googleProvider } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Link } from "react-router-dom";

// MISMO LISTADO DE ADMINS QUE EN AdminPedidos.jsx
const ADMIN_EMAILS = [
  "dylanc021684@gmail.com",
  "thagostina@gmail.com",
   "ellautysk8@gmail.com",
];


const Admin = () => {
  const [categoria, setCategoria] = useState("sahumerios");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");

  const [estado, setEstado] = useState(null);

  const [user, setUser] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [errorAuth, setErrorAuth] = useState(null);

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(false);

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
    setEditandoId(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado(null);

    if (!nombre || !descripcion || !precio || !imagen) {
      setEstado({ tipo: "error", mensaje: "Completá todos los campos." });
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

    try {
      if (editandoId) {
        // 🔁 Modo edición: actualizar producto existente
        const ref = doc(db, categoria, editandoId);
        await updateDoc(ref, {
          nombre,
          descripcion,
          precio: precioNumber,
          imagen,
        });

        setEstado({
          tipo: "ok",
          mensaje: "Producto actualizado correctamente.",
        });
      } else {
        // ➕ Modo creación: nuevo producto
        const colRef = collection(db, categoria);
        await addDoc(colRef, {
          nombre,
          descripcion,
          precio: precioNumber,
          imagen,
        });

        setEstado({
          tipo: "ok",
          mensaje: "Producto cargado correctamente.",
        });
      }

      limpiarFormulario();
      cargarProductos(categoria);
    } catch (err) {
      console.error("Error guardando producto:", err);
      setEstado({ tipo: "error", mensaje: "No se pudo guardar el producto." });
    }
  };

  const handleEditarProducto = (producto) => {
    setNombre(producto.nombre || "");
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio != null ? String(producto.precio) : "");
    setImagen(producto.imagen || "");
    setEditandoId(producto.id);
    setEstado({
      tipo: "info",
      mensaje: `Editando: ${producto.nombre}`,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1) Mientras chequea si estás logueado
  if (cargandoAuth) {
    return <p className="text-slate-300">Verificando sesión...</p>;
  }

  // 2) Si no hay usuario logueado → pedir login
  if (!user) {
    return (
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-semibold text-emerald-300">
          Panel admin – Iniciar sesión
        </h2>
        <p className="text-sm text-slate-400">
          Esta sección es sólo para administración de Armonía.ALD.
          Iniciá sesión con tu cuenta de Google para continuar.
        </p>

        <button
          onClick={handleLogin}
          className="px-4 py-2 rounded-full bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition-all"
        >
          Iniciar sesión con Google
        </button>

        {errorAuth && (
          <p className="text-xs text-red-300 mt-2">{errorAuth}</p>
        )}
      </div>
    );
  }

  // 3) Si hay usuario pero NO está en la lista de admins
  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-semibold text-emerald-300">
          Sin permisos
        </h2>
        <p className="text-sm text-slate-400">
          Estás logueado como{" "}
          <span className="text-emerald-300">{user.email}</span>, 
          pero esta cuenta no tiene acceso de administración.
        </p>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 text-xs hover:bg-slate-900 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  // 4) Si es un admin válido → mostrar formulario + listado de productos
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-emerald-300">
            Panel admin – {editandoId ? "Editar producto" : "Cargar producto"}
          </h2>
          <p className="text-xs text-slate-400">
            Logueado como{" "}
            <span className="text-emerald-300">{user.email}</span>
          </p>

          <Link
            to="/admin/pedidos"
            className="text-xs text-emerald-300 underline block mt-1"
          >
            Ver pedidos
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 text-xs hover:bg-slate-900 transition-all"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="text-sm text-slate-400">
        Desde acá podés cargar productos o editar los existentes en las colecciones
        de Firebase: sahumerios, aromatizantes y textil.
      </p>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4"
      >
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Categoría</label>
          <select
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
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
          <label className="text-xs text-slate-300">Nombre</label>
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Descripción</label>
          <textarea
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 min-h-[70px]"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Precio</label>
          <input
            type="number"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">URL de la imagen</label>
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 mt-2 py-2 rounded-full bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition-all"
          >
            {editandoId ? "Guardar cambios" : "Guardar producto"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="mt-2 px-3 py-2 rounded-full border border-slate-600 text-slate-200 text-xs hover:bg-slate-900 transition-all"
            >
              Cancelar edición
            </button>
          )}
        </div>

        {estado && (
          <p
            className={`text-xs mt-2 ${
              estado.tipo === "ok"
                ? "text-emerald-300"
                : estado.tipo === "info"
                ? "text-sky-300"
                : "text-red-300"
            }`}
          >
            {estado.mensaje}
          </p>
        )}
      </form>

      {/* Listado de productos de la categoría */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-emerald-300">
          Productos en {categoria}
        </h3>

        {cargandoProductos ? (
          <p className="text-slate-400 text-sm">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No hay productos cargados en esta categoría.
          </p>
        ) : (
          <div className="space-y-3">
            {productos.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3"
              >
                {p.imagen && (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-700 hidden xs:block"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}

                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-200">
                    {p.nombre}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {p.descripcion}
                  </p>
                  <p className="text-sm text-emerald-300 mt-1">
                    ${p.precio}
                  </p>
                </div>

                <button
                  onClick={() => handleEditarProducto(p)}
                  className="text-xs px-3 py-1 rounded-full border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 transition-all"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;

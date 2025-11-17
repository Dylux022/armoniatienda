import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ cartCount }) => {
  const [open, setOpen] = useState(false);

  const linkBase =
    "text-sm text-slate-200 hover:text-emerald-300 transition-colors";
  const activeClass = "text-emerald-300";

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Inicio
      </NavLink>

      <NavLink
        to="/sahumerios"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Sahumerios
      </NavLink>

      <NavLink
        to="/aromatizantes"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Aromatizantes
      </NavLink>

      <NavLink
        to="/textil"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Perfume textil
      </NavLink>

      {/* Link a Admin */}
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          `text-xs px-2 py-1 rounded-full border border-slate-600 hover:border-emerald-400 hover:text-emerald-300 transition-colors ${
            isActive ? "text-emerald-300" : "text-slate-300"
          }`
        }
        onClick={() => setOpen(false)}
      >
        Admin
      </NavLink>
    </>
  );

  return (
    <header className="bg-slate-950/80 border-b border-slate-800 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo / marca */}
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-xl font-semibold tracking-wide text-emerald-300">
            Armonía
          </span>
          <span className="text-sm font-medium text-emerald-500">.ald</span>
        </Link>

        {/* Menú desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks}
        </nav>

        {/* Cart + botón mobile */}
        <div className="flex items-center gap-3">
          {/* Carrito */}
          <Link
            to="/carrito"
            className="relative flex items-center gap-1 text-sm text-slate-200 hover:text-emerald-300 transition-colors"
            onClick={() => setOpen(false)}
          >
            <span role="img" aria-label="carrito">
              🛒
            </span>
            {cartCount > 0 && (
              <span className="text-xs bg-emerald-400 text-slate-950 rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Botón hamburguesa (solo mobile) */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-900 transition"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir menú"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-2">
            {navLinks}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

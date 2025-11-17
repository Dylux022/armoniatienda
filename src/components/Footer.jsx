import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-800 pt-6 pb-4 text-xs text-slate-500">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-emerald-300 font-medium">Armonía.ald</span>
          {" — "}
          Calma, fragancias y buena vibra. 🕯️
        </p>

        <div className="flex gap-4">
          <Link to="/sahumerios" className="hover:text-emerald-300">Sahumerios</Link>
          <Link to="/aromatizantes" className="hover:text-emerald-300">Aromatizantes</Link>
          <Link to="/textil" className="hover:text-emerald-300">Textil</Link>
          <Link to="/admin" className="hover:text-emerald-300">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

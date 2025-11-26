import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Sahumerios from "./pages/Sahumerios";
import Aromatizantes from "./pages/Aromatizantes";
import Textil from "./pages/Textil";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import PedidoEnviado from "./pages/PedidoEnviado";
import AdminPedidos from "./pages/AdminPedidos";
import ProductDetail from "./pages/ProductDetail";


const App = () => {
  // ✅ Inicializar carrito leyendo localStorage UNA sola vez
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const storedCart = localStorage.getItem("cart");
      if (!storedCart) return [];
      const parsed = JSON.parse(storedCart);
      if (!Array.isArray(parsed)) return [];
      // Normalizar para que siempre tenga cantidad (mínimo 1)
      return parsed.map((item) => ({
        ...item,
        cantidad: item.cantidad != null ? item.cantidad : 1,
      }));
    } catch (e) {
      console.error("Error leyendo carrito del localStorage", e);
      return [];
    }
  });

  // ✅ Cada vez que cambia el carrito, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 👉 Agregar producto al carrito (agrupando por id+categoria)
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const stock = product.stock ?? 9999; // si no tiene stock, asumimos "sin límite" por ahora

      const index = prev.findIndex(
        (item) =>
          item.id === product.id && item.categoria === product.categoria
      );

      if (index !== -1) {
        const existing = prev[index];
        const nuevaCantidad = existing.cantidad + 1;

        // No superar stock
        if (nuevaCantidad > stock) {
          // Podés cambiar esto a un toast lindo
          alert("No hay más stock disponible de este producto.");
          return prev;
        }

        const updated = [...prev];
        updated[index] = {
          ...existing,
          cantidad: nuevaCantidad,
        };
        return updated;
      }

      // Si no estaba en el carrito, lo agregamos con cantidad 1
      return [
        ...prev,
        {
          ...product,
          cantidad: 1,
        },
      ];
    });
  };

  // 👉 Quitar producto (una línea del carrito o vaciarlo)
  const handleRemoveFromCart = (idOrAll, categoria) => {
    if (idOrAll === "all") {
      setCart([]);
      return;
    }

    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === idOrAll && item.categoria === categoria)
      )
    );
  };

  // 👉 Actualizar cantidad (+1 o -1) con botones del carrito
  const handleUpdateItemQuantity = (id, categoria, delta) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id || item.categoria !== categoria) {
          return [item];
        }

        const stock = item.stock ?? 9999;
        const nuevaCantidad = item.cantidad + delta;

        // Si baja a 0 o menos, sacamos el producto del carrito
        if (nuevaCantidad <= 0) {
          return [];
        }

        // No pasar el stock
        if (nuevaCantidad > stock) {
          alert("No hay más stock disponible de este producto.");
          return [item];
        }

        return [
          {
            ...item,
            cantidad: nuevaCantidad,
          },
        ];
      })
    );
  };

  return (
    <BrowserRouter>
<div className="min-h-screen bg-[#f5f3f0] text-slate-900 flex flex-col antialiased">
  <Navbar cartCount={cart.length} />

       <main className="max-w-5xl mx-auto px-4 py-8 text-soft">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/sahumerios"
              element={
                <Sahumerios onAddToCart={handleAddToCart} cart={cart} />
              }
            />

            <Route
              path="/aromatizantes"
              element={
                <Aromatizantes onAddToCart={handleAddToCart} cart={cart} />
              }
            />

            <Route
              path="/textil"
              element={<Textil onAddToCart={handleAddToCart} cart={cart} />}
            />

            <Route
              path="/carrito"
              element={
                <Cart
                  cart={cart}
                  onRemoveItem={handleRemoveFromCart}
                  onUpdateItemQuantity={handleUpdateItemQuantity}
                />
              }
            />

            <Route path="/admin" element={<Admin />} />

            <Route
              path="/checkout"
              element={
                <Checkout cart={cart} onClearCart={() => setCart([])} />
              }
            />

            <Route path="/pedido-enviado" element={<PedidoEnviado />} />

            <Route path="/admin/pedidos" element={<AdminPedidos />} />

            <Route
  path="/producto/:categoria/:id"
  element={<ProductDetail onAddToCart={handleAddToCart} />}
/>

          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

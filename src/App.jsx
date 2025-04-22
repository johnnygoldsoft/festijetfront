import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Pages/Layout";
import "./App.css";
import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import { useContext } from "react";
import { AppContext } from "./Context/AppContext";
import Products from "./Pages/Products";
import Admin from "./Pages/admin";
import Create from "./pages/products/create";
import Show from "./pages/products/Show";
import Edit from "./pages/products/Edit";

export default function App() {
  const { user, loading } = useContext(AppContext);

  // Si l'utilisateur est en train de se charger, on peut afficher un loading spinner
  if (loading) {
    return <div className="p-6 max-w-7xl mx-auto">Chargement...</div>; // Ou tu peux afficher un loader ou un spinner ici
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />

          {/* Produits */}
          <Route path="/products" element={<Products />} />
          <Route
            path="/product/creer"
            element={user ? <Create /> : <Navigate to="/login" />}
          />
          <Route path="/product/:id" element={<Show />} />
          <Route
            path="/product/edit/:id/"
            element={user ? <Edit /> : <Navigate to="/login" />}
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={user && user.isAdmin ? <Admin /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

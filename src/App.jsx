import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import "./App.css";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import { useContext } from "react";
import { AppContext } from "./Context/AppContext";
import Create from "./pages/products/Create";
import Show from "./pages/products/Show";
import Edit from "./pages/products/Edit";
import Home from "./pages/Home";
import { BallTriangle } from "react-loader-spinner";

export default function App() {
  const { user, loading } = useContext(AppContext);

  // Si l'utilisateur est en train de se charger, on peut afficher un loading spinner

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-screen">
        <BallTriangle
          height={100}
          width={100}
          color="#4fa94d"
          ariaLabel="loading-indicator"
        />
      </div>
    );
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

          <Route
            path="/product/creer"
            element={user ? <Create /> : <Navigate to="/login" />}
          />
          <Route path="/product/:id" element={<Show />} />
          <Route
            path="/product/edit/:id/"
            element={user ? <Edit /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

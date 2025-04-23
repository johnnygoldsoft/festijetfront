import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ProductActions from "./ProductAction";

export default function Show() {
  const { id } = useParams();
  const { user } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = "https://festijet.houseofwood.net/storage/";

  const getProduct = async () => {
    try {
      const res = await fetch(
        `https://festijet.houseofwood.net/api/v1/products/${id}`
      );
      const data = await res.json();

      if (res.ok) {
        setProduct(data);
        setError("");
      } else {
        setError("Produit introuvable.");
      }
    } catch (err) {
      setError("Erreur de chargement du produit.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

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

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await axios.delete(
        `https://festijet.houseofwood.net/api/v1/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Produit supprimé !");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Échec de la suppression");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image */}
        <div className="lg:w-1/2">
          {product.image_url ? (
            <img
              src={`${baseUrl}${product.image_url}`}
              alt={product.name}
              className="rounded-xl w-full object-cover h-80"
            />
          ) : (
            <div className="bg-gray-100 h-80 rounded-xl flex items-center justify-center text-gray-400">
              Pas d’image
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="lg:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>

          <p className="text-xl text-blue-600 font-semibold">
            💰 {product.price} Cfa
          </p>
          <p className="text-gray-600 text-sm">Stock : {product.stock}</p>
          <p className="text-slate-700 leading-relaxed">
            {product.description || "Pas de description."}
          </p>

          {/* Bouton modifier */}
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}

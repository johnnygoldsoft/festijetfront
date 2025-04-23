import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";

export default function ProductActions({ product }) {
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await axios.delete(
        `https://festijet.houseofwood.net/api/v1/products/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Produit supprimé avec succès !");
      navigate("/home");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <div className="mt-4 d-flex">
      {user && (
        <>
          <Link
            to={`/product/edit/${product.id}`}
            className="inline-block mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium"
          >
            ✏️ Modifier le produit {product.id}
          </Link>

          <button
            onClick={handleDelete}
            className="mt-6 my-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
          >
            🗑 Supprimer le produit {product.id}
          </button>
        </>
      )}
    </div>
  );
}

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category_id: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");

  // Récupérer les catégories
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/categories")
      .then((res) => setCategories(res.data))
      .catch((err) =>
        console.error("Erreur lors de la récupération des catégories :", err)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_url") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.errors) {
        setMessage("Erreur : " + JSON.stringify(res.data.errors));
      } else {
        setMessage("Produit créé avec succès !");
        setFormData({
          name: "",
          price: "",
          stock: "",
          description: "",
          category_id: "",
          image_url: "",
        });

        setTimeout(() => navigate("/"), 1500); // Redirection après 1.5s
      }
    } catch (err) {
      console.error("Erreur lors de la création :", err);
      setMessage("Une erreur est survenue.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Créer un nouveau produit
      </h1>

      {message && (
        <div className="mb-4 text-center text-sm text-green-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium">Nom du produit :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Prix :</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Stock :</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-1"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Description :</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mt-1"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium">Catégorie :</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mt-1"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Image (optionnelle) :</label>
          <input
            type="file"
            name="image_url"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

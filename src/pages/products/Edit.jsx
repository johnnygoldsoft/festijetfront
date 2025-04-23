import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "", // Nouvel ajout pour la catégorie
    image_url: null,
  });

  const [categories, setCategories] = useState([]); // État pour stocker les catégories
  const [errors, setErrors] = useState({});

  // Fetch du produit existant
  const fetchProduct = async () => {
    const res = await fetch(
      `https://festijet.houseofwood.net/api/v1/products/${id}`
    );
    const data = await res.json();
    if (res.ok) {
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category_id: data.category_id, // Récupérer l'id de la catégorie actuelle
        image_url: null,
      });
    }
  };

  // Fetch des catégories disponibles
  const fetchCategories = async () => {
    const res = await fetch(
      "https://festijet.houseofwood.net/api/v1/categories"
    );
    const data = await res.json();
    if (res.ok) {
      setCategories(data); // Mettre à jour l'état avec les catégories récupérées
    }
  };

  useEffect(() => {
    if (user) {
      fetchProduct();
      fetchCategories(); // Charger les catégories au début
    } else {
      navigate("/login");
    }
  }, []);

  // Gestion des changements dans le form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    payload.append("category_id", formData.category_id);
    if (formData.image_url) {
      payload.append("image_url", formData.image_url);
    }
    payload.append("_method", "PUT");

    const res = await fetch(
      `https://festijet.houseofwood.net/api/v1/products/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );

    // Vérifier la réponse du serveur
    const data = await res.json();
    if (res.ok) {
      navigate(`/product/${id}`);
    } else {
      console.error("Erreur côté serveur:", data); // Afficher l'erreur dans la console pour debug
      setErrors(data.errors || { general: "Une erreur s'est produite." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        ✏️ Modifier le produit {id} {user.token}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock[0]}</p>
            )}
          </div>
        </div>

        {/* Sélecteur de catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Catégorie
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>
              Sélectionner une catégorie
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image (optionnel)
          </label>
          <input
            type="file"
            name="image_url"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}

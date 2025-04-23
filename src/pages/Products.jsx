import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const baseUrl = "https://festijet.houseofwood.net/storage/";

  const getProducts = async () => {
    const res = await fetch("/api/v1/products");
    const data = await res.json();
    if (res.ok) {
      setProducts(data);
      setFiltered(data);
    }
  };

  const getCategories = async () => {
    const res = await fetch("/api/v1/categories");
    const data = await res.json();
    if (res.ok) {
      setCategories(data);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  useEffect(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      data = data.filter((p) => p.category_id === parseInt(selectedCategory));
    }

    setFiltered(data);
    setCurrentPage(1); // Reset page on filter/search change
  }, [search, selectedCategory, products]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalpages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛍️ Les Produits Disponibles
      </h1>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-2/3"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/3"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {/* Bouton de création de produit */}
        <Link
          to="/product/creer"
          className="inline-block py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-4"
        >
          Ajouter
        </Link>
      </div>

      {/* 🧾 Liste des produits */}
      {currentItems.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg hover:border-2 hover:border-blue-600 transition"
            >
              <img
                src={`${baseUrl}${post.image_url}`}
                alt={post.name}
                className="h-40 w-full object-cover mb-4 justify-center items-center rounded-md bg-gray-300"
              />
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                {post.name}
              </h2>
              <p className="text-slate-600 mb-2">💰 {post.price} Cfa</p>
              <Link
                to={`/product/${post.id}`}
                className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Voir le produit
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          Aucun produit trouvé...
        </p>
      )}

      {/* 📄 Pagination */}
      {totalpages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(totalpages).keys()].map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === n + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {n + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

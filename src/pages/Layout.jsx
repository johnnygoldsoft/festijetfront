import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function Layout() {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const baseUrl = "https://festijet.houseofwood.net";

  async function handleLogout(e) {
    e.preventDefault();

    const res = await fetch(`${baseUrl}/api/logout`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("access_token");
      navigate("/");
    }
  }

  return (
    <>
      <header className="bg-gray-800 text-white shadow-md">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-white transition duration-300"
          >
            FESTIJET | Dashboard
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <p className="text-sm text-gray-300">Bienvenue , {user.name}</p>
                <form onSubmit={handleLogout}>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition duration-300">
                    Se Deconnecter
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-300 hover:text-white transition duration-300"
                >
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </>
  );
}

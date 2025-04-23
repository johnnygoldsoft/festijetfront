import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://festijet.houseofwood.net";

  async function getUser() {
    try {
      const res = await fetch(`${baseUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error("Erreur getUser:", error);
    } finally {
      setLoading(false); // 🆕 Important
    }
  }

  useEffect(() => {
    if (token) {
      getUser();
    } else {
      setLoading(false); // 🆕 Même si pas de token
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, loading }}>
      {children}
    </AppContext.Provider>
  );
}

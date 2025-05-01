import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Register() {
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const baseUrl = "https://festijet.houseofwood.net";

  const [formData, setFormDate] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/register`, {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      method: "post",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.errors) {
      setErrors(data.errors);
    } else {
      localStorage.setItem("access_token", data.access_token);
      setToken(data.token);
      navigate("/");
      console.log(data);
    }

    console.log(data);
  }

  return (
    <>
      <h1 className="title">Espace d'inscription </h1>
      {token}
      <form onSubmit={handleRegister} className="w-1/2 mx-auto space-y-6">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormDate({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error">{errors.name[0]}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Votre mail"
            value={formData.email}
            onChange={(e) =>
              setFormDate({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <p className="error">{errors.email[0]}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={(e) =>
              setFormDate({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirmer votre mot de passe"
            value={formData.password_confirmation}
            onChange={(e) =>
              setFormDate({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
          />
          {errors.password_confirmation && (
            <p className="error">{errors.password_confirmation[0]}</p>
          )}
        </div>

        <button className="primary-btn">Inscrire</button>
      </form>
    </>
  );
}

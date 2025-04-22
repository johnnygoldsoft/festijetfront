import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Login() {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormDate] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "post",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    console.log(data);

    if (data.errors) {
      setErrors(data.errors);
    } else {
      localStorage.setItem("access_token", data.access_token);
      setToken(data.access_token);
      navigate("/");
      console.log(data);
    }

    console.log(data);
  }

  return (
    <>
      <h1 className="title">Login to your account</h1>

      <form onSubmit={handleLogin} className="w-1/2 mx-auto space-y-6">
        <div>
          <input
            type="text"
            placeholder="Email"
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
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormDate({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}
        </div>

        <button className="primary-btn">Se Connecter</button>
      </form>
    </>
  );
}

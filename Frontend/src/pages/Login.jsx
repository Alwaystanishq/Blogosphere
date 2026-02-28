import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await api.post("/auth/login", form);

      if (res.data.success) {
        setUser(res.data.user);
        navigate("/myblog");
      }

    } catch (err) {

      setError(
        err.response?.data?.message || "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex justify-center pt-20 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Blogosphere
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="underline font-medium">
            Signup
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await api.post("/user/login", form);

      if (res.data.success) {
        setUser(res.data.user);
        navigate(location.state?.from || "/latest", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Welcome back.
        </h1>

        <p className="text-center text-zinc-500 mb-8">
          Your next read is waiting. Sign in to pick up where you left off.
        </p>

        {error && (
          <div role="alert" className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} aria-busy={loading} className="auth-form space-y-5">
          <label className="form-label" htmlFor="login-email">Email address</label>
          <input
            type="email"
            id="login-email"
            autoComplete="email"
            name="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="login-password"
            autoComplete="current-password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <button type="button" className="password-toggle" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide password" : "Show password"}</button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-zinc-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Create an account
          </Link>
        </p>
    </AuthLayout>
  );
}

export default Login;

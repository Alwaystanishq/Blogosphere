import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profilePic: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      setForm({
        ...form,
        profilePic: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);

      if (form.profilePic) {
        formData.append("profilePic", form.profilePic);
      }

      const res = await api.post("/user/signup", formData);

      if (res.data.success) {
        setUser(res.data.user);
        navigate("/myblog");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-b from-indigo-50 to-white">
      <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8 w-full max-w-md">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Join Blogosphere
        </h2>

        <p className="text-center text-zinc-500 mb-8">
          Create your account and start sharing your stories.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />

          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-2">
              Profile Picture (Optional)
            </label>

            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-zinc-300 rounded-xl p-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-zinc-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

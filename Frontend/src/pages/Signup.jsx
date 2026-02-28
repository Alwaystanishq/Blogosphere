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

      const res = await api.post("/auth/signup", formData);

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
    <div className="flex justify-center pt-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Signup to Blogosphere
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

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

          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

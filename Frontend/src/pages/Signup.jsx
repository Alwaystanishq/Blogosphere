import AuthLayout from "../components/AuthLayout";
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
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthLayout className="signup-page">
      <h1>Make yourself at home.</h1>
      <p>Create your account and start sharing your stories.</p>
      {error && <div role="alert" className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} aria-busy={loading} className="auth-form signup-form">
        <div className="signup-fields">
          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" type="text" autoComplete="name" name="name" placeholder="Full name" required value={form.name} onChange={handleChange} />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-username">Username</label>
            <input id="signup-username" type="text" autoComplete="username" name="username" placeholder="Username" required value={form.username} onChange={handleChange} />
          </div>
          <div className="auth-field auth-field-wide">
            <label htmlFor="signup-email">Email address</label>
            <input id="signup-email" type="email" autoComplete="email" name="email" placeholder="you@example.com" required value={form.email} onChange={handleChange} />
          </div>
          <div className="auth-field auth-field-wide">
            <label htmlFor="signup-password">Password</label>
            <div className="password-field">
              <input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" name="password" placeholder="Choose a password" required value={form.password} onChange={handleChange} />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
            </div>
          </div>
        </div>
        <details className="signup-picture">
          <summary>Profile picture <span>(optional{form.profilePic ? ", selected" : ""})</span></summary>
          <label htmlFor="signup-picture">Choose a JPEG or PNG image</label>
          <input id="signup-picture" type="file" name="profilePic" accept="image/jpeg,image/png" onChange={handleChange} />
        </details>
        <button type="submit" disabled={loading} className="button-primary">{loading ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}

export default Signup;

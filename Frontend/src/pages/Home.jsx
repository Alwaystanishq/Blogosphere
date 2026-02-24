import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <p>Checking authentication...</p>;
  }
  if (isAuthenticated) {
    return <Navigate to="/myblog" replace />;
  }
  return (
    <div>
      <h1>Welcome to the Blogging Website</h1>
      <p>Please login or signup to continue</p>
    </div>
  );
};

export default Home;

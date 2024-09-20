import { useEffect, useState } from "react";
import { logout, getMe } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      const response = await logout();
      alert(response.message);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMe();
        setUser(res);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin className="mx-auto my-40" size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h2>
      <p className="text-gray-600 mb-6">You are now logged in.</p>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;

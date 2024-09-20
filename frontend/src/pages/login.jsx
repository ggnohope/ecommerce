import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const setFieldsValue = ({ target: { name, value } }) => {
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(fields);
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    navigate("/signup");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin className="mx-auto my-40" size="large" />
      </div>
    );
  }

  return (
    <div className="w-[400px] mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={fields.email}
            onChange={setFieldsValue}
            placeholder="Email"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={fields.password}
            onChange={setFieldsValue}
            placeholder="Password"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Login
        </button>
      </form>
      <p className="text-sm mt-4 text-gray-600">
        Dont have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-indigo-600 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;

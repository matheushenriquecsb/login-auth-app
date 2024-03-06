import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import OAuth from "../components/OAuth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      await axios.post(`${BASE_URL}/signup`, formData);
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Cadastre-se</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Já possui conta?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Login</span>
        </Link>
      </div>
      <p
        className={`mt-5 text-center ${
          error ? "text-red-700" : "text-green-700"
        }`}
      >
        {error ? "Erro ao cadastrar" : ""}
      </p>
    </div>
  );
}

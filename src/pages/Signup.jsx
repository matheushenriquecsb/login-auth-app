import { useState } from "react";
import { Link } from "react-router-dom";
import signUp from "../hooks/fetch.api";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({});

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const data = await signUp(formData);
      if (data.statusCode === 400) setError(true);
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
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Cadastre-se
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

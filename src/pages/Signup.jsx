import axios from "axios";
import { useState } from "react";
import { Input, Tooltip } from "antd";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import OAuth from "../components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      await axios.post(`${import.meta.env.VITE_BASE_URL}/signup`, formData);
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Cadastre-se</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Username"
          type="text"
          id="username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
          suffix={
            <Tooltip title="No máximo 8 caracteres">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
        <Input
          size="large"
          type="text"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <Input.Password
          type="text"
          id="password"
          placeholder="Senha"
          className="bg-slate-100 rounded-lg p-3"
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? <LoadingOutlined /> : "Cadastre-se"}
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

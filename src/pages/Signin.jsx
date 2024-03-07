import axios from "axios";
import { Input } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/signin`,
        formData
      );
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  console.log(error);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {loading ? "Loading..." : "Login"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Não possui conta?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Cadastre-se</span>
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

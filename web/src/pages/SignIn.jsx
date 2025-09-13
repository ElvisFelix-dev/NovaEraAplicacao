import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import FormError from "../components/FormError";

import api from "../service/api";
import imgLogo from "../assets/logoVisionario.png";

// Validação com Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("Por favor, insira um email válido"),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "A senha deve conter ao menos 1 letra maiúscula, 1 número e 1 caractere especial"
    ),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/api/users/login", data);

      const user = res.data.user || res.data;

      toast.success(`👋 Bem-vindo, ${user.name || "Usuário"}!`);

      localStorage.setItem("userInfo", JSON.stringify(res.data));

      if (user.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }

      window.location.reload();
    } catch (err) {
      const message = err.response?.data?.message || "Erro ao realizar login";
      toast.error(message);
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg dark:border dark:bg-gray-800 dark:border-gray-700">
        {/* Logo */}
        <div className="flex justify-center mt-6">
          <img
            className="w-20 h-20 rounded-full shadow-lg hover:scale-105 hover:shadow-blue-400/50 transition-all duration-300"
            src={imgLogo}
            alt="logo"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 space-y-6">
          <h1 className="text-center text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Faça login na sua conta
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                {...register("email")}
                placeholder="name@company.com"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-200 hover:border-blue-400"
              />
              <FormError message={errors.email?.message} />
            </div>

            {/* Senha */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-200 hover:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={22} />
                ) : (
                  <AiFillEye size={22} />
                )}
              </button>
              <FormError message={errors.password?.message} />
            </div>

            {/* Lembrar / Esqueci senha */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 bg-gray-50 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                />
                Lembrar Senha
              </label>
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-3 text-center transition-all duration-200"
            >
              Entrar
            </button>

            {/* Link SignUp */}
            <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
              Não tem sua conta?{" "}
              <Link
                to="/sign-up"
                className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400"
              >
                Cadastrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

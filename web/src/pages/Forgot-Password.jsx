import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import FormError from "../components/FormError";
import api from "../service/api.jsx";
import imgLogo from "../assets/logoVisionario.png";

// 📌 Validação com Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("Por favor, insira um email válido"),
});


export default function ForgtPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 📌 Envio para backend
  const onSubmit = async (data) => {
    try {
      // Aqui você conecta com sua rota de recuperação de senha (exemplo)
      const res = await api.post("/api/users/forgot-password", data);

      toast.success("Email enviado com sucesso.");
      reset();
    } catch (error) {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    }
  };
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
            Esqueceu a senha?
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

            {/* Botão */}
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-3 text-center transition-all duration-200"
            >
              Enviar E-mail
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

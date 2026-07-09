import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginApi } from "../../api/authApi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.ok && res.data) {
        login(res.data.user, res.data.token);
        const route = res.data.user.role === "waiter" ? "/tables" : "/dashboard";
        navigate(route);
      } else {
        setError(res.msg || "Credenciales inválidas");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-theme="cafe"
      className="min-h-screen bg-gradient-to-br from-primary to-neutral flex items-center justify-center p-4"
    >
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <div className="card-body px-10 py-12">
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="CafeFlow"
              className="max-w-[180px] h-auto mx-auto"
            />
            <p className="text-base-content/60 text-sm mt-3">
              Inicia sesión en tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text text-base-content/80 font-medium">
                  Correo electrónico
                </span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                className="input input-bordered w-full text-base-content"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control mb-2">
              <label className="label" htmlFor="password">
                <span className="label-text text-base-content/80 font-medium">
                  Contraseña
                </span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full text-base-content"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <label className="label mb-4">
              <Link
                to="/forgot-password"
                className="label-text-alt text-base-content/50 hover:text-primary link link-hover text-sm"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </label>

            {error && (
              <div
                role="alert"
                className="alert alert-error mb-4 py-2.5 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full text-primary-content ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

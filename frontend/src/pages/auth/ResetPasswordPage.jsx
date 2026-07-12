import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res.ok) {
        setDone(true);
      } else {
        setError(res.msg || "Error al restablecer la contraseña");
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
              {done ? "Contraseña restablecida" : "Nueva contraseña"}
            </p>
          </div>

          {done ? (
            <div className="text-center">
              <div
                role="alert"
                className="alert alert-success mb-4 py-3 text-sm bg-green-50 border border-green-200 text-green-700 rounded-lg"
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
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                <span>Tu contraseña ha sido restablecida exitosamente.</span>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary w-full text-primary-content"
              >
                Iniciar Sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label" htmlFor="password">
                  <span className="label-text text-base-content/80 font-medium">
                    Nueva contraseña
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
                  minLength={6}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label" htmlFor="confirm">
                  <span className="label-text text-base-content/80 font-medium">
                    Confirmar contraseña
                  </span>
                </label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full text-base-content"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl mb-4"
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
                className="btn btn-primary w-full text-primary-content"
                disabled={loading}
              >
                {loading ? <><span className="loading loading-spinner loading-xs" /> Guardando...</> : "Restablecer contraseña"}
              </button>

              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-base-content/50 hover:text-primary link link-hover text-sm"
                >
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

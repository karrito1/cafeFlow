import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.ok) {
        setSent(true);
      } else {
        setError(res.msg || "Error al enviar el correo");
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
              {sent
                ? "Revisa tu correo electrónico"
                : "Recupera tu contraseña"}
            </p>
          </div>

          {sent ? (
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
                    d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.98l7.5-4.04a2.25 2.25 0 0 1 2.134 0l7.5 4.04a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
                  />
                </svg>
                <span>
                  Si el correo está registrado, recibirás un enlace para
                  restablecer tu contraseña.
                </span>
              </div>
              <Link
                to="/login"
                className="btn btn-outline btn-primary w-full text-sm"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          ) : (
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
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
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

export default ForgotPasswordPage;

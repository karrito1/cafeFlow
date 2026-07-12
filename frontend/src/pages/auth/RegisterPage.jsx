import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../api/customerApi";
import { toast } from "sonner";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.email.trim()) {
      setError("El correo es obligatorio");
      return;
    }
    if (!form.password) {
      setError("La contraseña es obligatoria");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomer({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });
      if (res.ok) {
        toast.success("Cuenta creada. Inicia sesión para continuar");
        navigate("/login");
      } else {
        setError(res.msg || "Error al crear la cuenta");
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
              Crea tu cuenta para acumular puntos
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label" htmlFor="name">
                <span className="label-text text-base-content/80 font-medium">
                  Nombre completo
                </span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                className="input input-bordered w-full text-base-content"
                value={form.name}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text text-base-content/80 font-medium">
                  Correo electrónico
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                className="input input-bordered w-full text-base-content"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label" htmlFor="phone">
                <span className="label-text text-base-content/80 font-medium">
                  Teléfono
                </span>
                <span className="label-text-alt text-base-content/40">
                  Opcional
                </span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Ej: 3001234567"
                className="input input-bordered w-full text-base-content"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-control mb-4">
              <label className="label" htmlFor="password">
                <span className="label-text text-base-content/80 font-medium">
                  Contraseña
                </span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="input input-bordered w-full text-base-content"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-control mb-2">
              <label className="label" htmlFor="confirm">
                <span className="label-text text-base-content/80 font-medium">
                  Confirmar contraseña
                </span>
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full text-base-content"
                value={form.confirm}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 mb-4 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl"
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
              {loading ? <><span className="loading loading-spinner loading-xs" /> Creando cuenta...</> : "Crear Cuenta"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-base-content/50 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium link link-hover"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

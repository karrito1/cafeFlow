import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/userApi";

function UserFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await createUser(form);
      if (res.ok) {
        navigate("/users");
      } else {
        setError(res.msg || "Error al crear usuario");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/users")} className="btn btn-ghost btn-sm btn-square">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-base-content">Nuevo Usuario</h1>
            <p className="text-sm text-base-content/60">Crear un nuevo administrador</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-6">
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label" htmlFor="name">
                  <span className="label-text font-medium">Nombre completo</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="input input-bordered w-full"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label" htmlFor="email">
                  <span className="label-text font-medium">Correo electrónico</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@cafeflow.com"
                  className="input input-bordered w-full"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label" htmlFor="password">
                  <span className="label-text font-medium">Contraseña</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="input input-bordered w-full"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-control mb-6">
                <label className="label" htmlFor="role">
                  <span className="label-text font-medium">Rol</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className="select select-bordered w-full"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="admin">Admin</option>
                  <option value="barista">Barista</option>
                  <option value="cashier">Cajero</option>
                </select>
              </div>

              {error && (
                <div
                  role="alert"
                  className="alert alert-error mb-4 py-2.5 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Usuario"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFormPage;

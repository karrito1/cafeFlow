import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { Users, Plus, Trash2 } from "lucide-react";

function UserModal({ isOpen, onClose, onSave, user }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "admin",
      });
    } else {
      setForm({ name: "", email: "", password: "", role: "admin" });
    }
    setError("");
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!user && !form.password) {
      setError("La contraseña es obligatoria");
      return;
    }
    setLoading(true);
    try {
      await onSave(form, user);
      onClose();
    } catch (err) {
      setError(err?.msg || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="card bg-base-100 w-full max-w-md shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="card-body px-8 py-8">
          <h2 className="text-lg font-bold text-base-content mb-4">
            {user ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nombre completo</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Correo electrónico</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  {user ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña"}
                </span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={user ? "Sin cambios" : "Mínimo 6 caracteres"}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Rol</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="waiter">Mesero</option>
              </select>
            </div>
            {error && <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl"><svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>{error}</div>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UserListPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      if (res.ok) setUsers(res.data);
      else toast.error(res.msg || 'Error al cargar usuarios');
    } catch {
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (form, user) => {
    const data = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };
    if (user) {
      if (form.password) data.password = form.password;
      const res = await updateUser(user._id, data);
      if (!res.ok) throw res;
      toast.success('Usuario actualizado');
    } else {
      data.password = form.password;
      const res = await createUser(data);
      if (!res.ok) throw res;
      toast.success('Usuario creado');
    }
    await fetchData();
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res.ok) {
        toast.success('Usuario eliminado');
      } else {
        toast.error(res.msg || 'Error al eliminar usuario');
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    }
    setDeleting(null);
    await fetchData();
  };

  const filteredUsers = users.filter((u) => u._id !== currentUser?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Usuarios</h1>
            <p className="text-sm text-base-content/60">
              {filteredUsers.length} usuarios
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus size={18} />
            Nuevo Usuario
          </button>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <Users size={48} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-lg font-semibold text-base-content">
                No hay usuarios
              </h3>
              <p className="text-sm text-base-content/40">
                Crea el primer usuario del sistema
              </p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                + Crear Usuario
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-base-content/60 text-sm">
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-base-200">
                      <td className="font-medium text-base-content">
                        {user.name}
                      </td>
                      <td className="text-base-content/70">{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === "admin"
                              ? "badge-soft badge-warning"
                              : "badge-soft badge-neutral"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "Mesero"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            user.active
                              ? "badge-soft badge-success"
                              : "badge-soft badge-error"
                          } text-xs`}
                        >
                          {user.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => {
                            setEditing(user);
                            setModalOpen(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => setDeleting(user)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          user={editing}
        />

        {deleting && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleting(null)}
          >
            <div
              className="card bg-base-100 w-full max-w-sm shadow-2xl mx-4 text-center p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={40} className="mx-auto mb-4 text-error" />
              <h3 className="text-lg font-bold text-base-content">
                Eliminar Usuario
              </h3>
              <p className="text-sm text-base-content/60 mt-2">
                ¿Eliminar a "{deleting.name}"?
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  className="btn btn-ghost"
                  onClick={() => setDeleting(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => handleDelete(deleting._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserListPage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { Users, Plus, Trash2 } from "lucide-react";

function UserListPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      if (res.ok) setUsers(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await deleteUser(id);
    if (res.ok) {
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Usuarios</h1>
            <p className="text-sm text-base-content/60 mt-1">Gestiona los usuarios del sistema</p>
          </div>
          <Link to="/users/new" className="btn btn-primary">
            <Plus size={18} />
            Nuevo Usuario
          </Link>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-12 w-full"></div>
                ))}
              </div>
            ) : users.filter((u) => u._id !== currentUser?.id).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="text-base-content/60 text-sm">
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter((u) => u._id !== currentUser?.id).map((user) => (
                      <tr key={user._id} className="hover:bg-base-200">
                        <td className="font-medium text-base-content">{user.name}</td>
                        <td className="text-base-content/70">{user.email}</td>
                        <td>
                          <span className={`badge ${
                            user.role === "admin" ? "badge-soft badge-warning" :
                            user.role === "barista" ? "badge-soft badge-info" :
                            "badge-soft badge-neutral"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.active ? "badge-soft badge-success" : "badge-soft badge-error"} text-xs`}>
                            {user.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="btn btn-ghost btn-sm btn-square text-error"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-base-content/50">No hay usuarios registrados</p>
                <Link to="/users/new" className="btn btn-primary btn-sm mt-4">
                  Crear Primer Usuario
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserListPage;

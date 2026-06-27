import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';

function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    priceS: '',
    priceM: '',
    priceL: '',
    categoryId: '',
    featured: false,
    stock: '0',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      const catRes = await getCategories();
      if (catRes.ok) setCategories(catRes.data);

      if (isEdit) {
        const prodRes = await getProduct(id);
        if (prodRes.ok) {
          const p = prodRes.data;
          setForm({
            name: p.name || '',
            description: p.description || '',
            priceS: p.price?.S ?? '',
            priceM: p.price?.M ?? '',
            priceL: p.price?.L ?? '',
            categoryId: p.categoryId?._id || p.categoryId || '',
            featured: p.featured || false,
            stock: String(p.stock ?? 0),
          });
        }
      }
      setLoading(false);
    };
    init();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    if (!form.categoryId) { setError('Selecciona una categoría'); return; }
    if (!form.priceM) { setError('El precio M es obligatorio'); return; }

    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: {
          S: form.priceS ? Number(form.priceS) : undefined,
          M: Number(form.priceM),
          L: form.priceL ? Number(form.priceL) : undefined,
        },
        categoryId: form.categoryId,
        featured: form.featured,
        stock: Number(form.stock) || 0,
      };

      const res = isEdit ? await updateProduct(id, data) : await createProduct(data);
      if (res.ok) {
        navigate('/products');
      } else {
        setError(res.msg || 'Error al guardar');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <button className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content mb-4" onClick={() => navigate('/products')}>
          ← Volver a Productos
        </button>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body px-8 py-8">
            <h1 className="text-2xl font-bold text-base-content mb-6">
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Nombre *</span></label>
                <input className="input input-bordered" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Cappuccino" autoFocus />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Descripción</span></label>
                <textarea className="textarea textarea-bordered" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ej: Espresso con leche vaporizada y espuma" />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Categoría *</span></label>
                <select className="select select-bordered" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Seleccionar categoría</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label"><span className="label-text font-medium">Precios</span></label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="form-control">
                    <label className="label"><span className="label-text text-xs text-base-content/60">Small (S)</span></label>
                    <input type="number" step="100" className="input input-bordered" value={form.priceS} onChange={(e) => setForm({ ...form, priceS: e.target.value })} placeholder="$0" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text text-xs text-base-content/60">Medium (M) *</span></label>
                    <input type="number" step="100" className="input input-bordered" value={form.priceM} onChange={(e) => setForm({ ...form, priceM: e.target.value })} placeholder="$0" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text text-xs text-base-content/60">Large (L)</span></label>
                    <input type="number" step="100" className="input input-bordered" value={form.priceL} onChange={(e) => setForm({ ...form, priceL: e.target.value })} placeholder="$0" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Stock</span></label>
                  <input type="number" className="input input-bordered" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Destacado</span></label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="checkbox" className="toggle toggle-primary" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                    <span className="text-sm text-base-content/60">{form.featured ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              </div>

              {error && <div className="alert alert-error py-2 text-sm">{error}</div>}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/products')}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFormPage;

import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { formatCurrency } from '../../utils/formatters';
import { X, Coffee, Trash2 } from 'lucide-react';

function ProductModal({ isOpen, onClose, onSaved, productId, categories }) {
  const [form, setForm] = useState({
    name: '', description: '', priceS: '', priceM: '', priceL: '',
    categoryId: '', featured: false, stock: '0',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(productId);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (productId) {
      setLoading(true);
      getProduct(productId).then((res) => {
        if (res.ok) {
          const p = res.data;
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
        setLoading(false);
      });
    } else {
      setForm({ name: '', description: '', priceS: '', priceM: '', priceL: '', categoryId: '', featured: false, stock: '0' });
    }
  }, [productId, isOpen]);

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
      const res = isEdit ? await updateProduct(productId, data) : await createProduct(data);
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        setError(res.msg || 'Error al guardar');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="card bg-base-100 w-full max-w-lg shadow-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="card-body px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-base-content">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}><X size={18} /></button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><span className="loading loading-spinner loading-lg text-primary"></span></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Nombre *</span></label>
                <input className="input input-bordered w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Cappuccino" autoFocus />
              </div>
              <div className="form-control">
                <input className="input input-bordered w-full" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción — Ej: Espresso con leche vaporizada y espuma" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Categoría *</span></label>
                <select className="select select-bordered w-full" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Seleccionar categoría</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text font-medium">Precios</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {['S', 'M', 'L'].map((size) => (
                    <label key={size} className="form-control">
                      <span className="label-text text-xs text-base-content/60 mb-1">{size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'} ({size}){size === 'M' ? ' *' : ''}</span>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-base-content/40 text-sm">$</span>
                        <input type="number" step="100" className="input input-bordered w-full pl-6 text-sm" value={form[`price${size}`]} onChange={(e) => setForm({ ...form, [`price${size}`]: e.target.value })} placeholder="0" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Stock</span></label>
                  <input type="number" className="input input-bordered w-full" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
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
                <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="loading loading-spinner loading-xs"></span> Guardando...</> : isEdit ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
      if (prodRes.ok) setProducts(prodRes.data);
      if (catRes.ok) setCategories(catRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setDeleting(null);
    await fetchData();
  };

  const openEdit = (id) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    fetchData();
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.categoryId?._id === filterCat || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  const catMap = {};
  categories.forEach((c) => { catMap[c._id] = c.name; });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Productos</h1>
            <p className="text-sm text-base-content/60">{products.length} productos</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Producto</button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input input-bordered w-full sm:max-w-xs"
            placeholder="Buscar producto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered w-full sm:max-w-xs"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <Coffee size={48} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-lg font-semibold text-base-content">
                {products.length === 0 ? 'No hay productos' : 'Sin resultados'}
              </h3>
              <p className="text-sm text-base-content/40">
                {products.length === 0 ? 'Agrega tu primer producto al menú' : 'Intenta con otros filtros'}
              </p>
              {products.length === 0 && (
                <button className="btn btn-primary mt-4" onClick={openCreate}>+ Crear Producto</button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p._id} className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary transition-colors">
                <figure className="h-40 bg-base-200 flex items-center justify-center overflow-hidden rounded-t-xl">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Coffee size={48} className="opacity-30" />
                  )}
                </figure>
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base-content truncate">{p.name}</h3>
                    {p.featured && <span className="badge badge-soft badge-warning text-[10px] shrink-0">Destacado</span>}
                  </div>
                  <p className="text-xs text-base-content/50 line-clamp-2">{p.description || ''}</p>
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    {p.price?.S && <span className="text-base-content/60">S: {formatCurrency(p.price.S)}</span>}
                    <span className="font-semibold text-primary">M: {formatCurrency(p.price?.M || 0)}</span>
                    {p.price?.L && <span className="text-base-content/60">L: {formatCurrency(p.price.L)}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-base-content/40">{catMap[p.categoryId?._id || p.categoryId] || '—'}</span>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-xs" onClick={() => openEdit(p._id)}>Editar</button>
                      <button className="btn btn-ghost btn-xs text-error" onClick={() => setDeleting(p)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ProductModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingId(null); }}
          onSaved={handleSaved}
          productId={editingId}
          categories={categories}
        />

        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleting(null)}>
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-4 text-center p-8" onClick={(e) => e.stopPropagation()}>
              <Trash2 size={40} className="mx-auto mb-4 text-error" />
              <h3 className="text-lg font-bold text-base-content">Eliminar Producto</h3>
              <p className="text-sm text-base-content/60 mt-2">¿Eliminar "{deleting.name}"?</p>
              <div className="flex justify-center gap-3 mt-6">
                <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancelar</button>
                <button className="btn btn-error" onClick={() => handleDelete(deleting._id)}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;

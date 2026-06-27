import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { formatCurrency } from '../../utils/formatters';

function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
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
          <Link to="/products/new" className="btn btn-primary">+ Nuevo Producto</Link>
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
              <div className="text-5xl mb-4 opacity-30">☕</div>
              <h3 className="text-lg font-semibold text-base-content">
                {products.length === 0 ? 'No hay productos' : 'Sin resultados'}
              </h3>
              <p className="text-sm text-base-content/40">
                {products.length === 0 ? 'Agrega tu primer producto al menú' : 'Intenta con otros filtros'}
              </p>
              {products.length === 0 && (
                <Link to="/products/new" className="btn btn-primary mt-4">+ Crear Producto</Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p._id} className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary transition-colors">
                <figure className="h-40 bg-base-200 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl opacity-30">☕</span>
                  )}
                </figure>
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base-content truncate">{p.name}</h3>
                    {p.featured && <span className="badge badge-soft badge-warning text-[10px]">Destacado</span>}
                  </div>
                  <p className="text-xs text-base-content/50 line-clamp-2">{p.description || ''}</p>
                  <div className="flex items-center gap-2 text-sm">
                    {p.price?.S && <span className="text-base-content/60">S: {formatCurrency(p.price.S)}</span>}
                    <span className="font-semibold text-primary">M: {formatCurrency(p.price?.M || 0)}</span>
                    {p.price?.L && <span className="text-base-content/60">L: {formatCurrency(p.price.L)}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-base-content/40">{catMap[p.categoryId?._id || p.categoryId] || '—'}</span>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-xs" onClick={() => navigate(`/products/${p._id}/edit`)}>Editar</button>
                      <button className="btn btn-ghost btn-xs text-error" onClick={() => setDeleting(p)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleting(null)}>
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-4 text-center p-8" onClick={(e) => e.stopPropagation()}>
              <div className="text-4xl mb-4">🗑️</div>
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

import { useState, useEffect } from 'react';
import { Coffee, Search, X } from 'lucide-react';
import { getProducts } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { formatCurrency } from '../../utils/formatters';

const SIZES = ['S', 'M', 'L'];

function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (pRes.ok) setProducts(pRes.data);
        if (cRes.ok) setCategories(cRes.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const catMap = {};
  categories.forEach((c) => { catMap[c._id] = c.name; });

  const filteredProducts = products.filter((p) => {
    const catMatch = selectedCategory === 'all' || p.categoryId === selectedCategory || p.categoryId?._id === selectedCategory;
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch && p.active !== false;
  });

  const sortedCats = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
            <h1 className="text-2xl font-bold text-base-content">Menú Digital</h1>
            <p className="text-sm text-base-content/60">Explora nuestra selección de cafés y bebidas</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row max-w-xl">
          <div className="join flex-1">
            <span className="btn btn-bordered join-item pointer-events-none">
              <Search size={16} className="text-base-content/40" />
            </span>
            <input
              className="input input-bordered join-item w-full"
              placeholder="Buscar producto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn join-item" onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-soft btn-primary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            Todos
          </button>
          {sortedCats.map((cat) => (
            <button
              key={cat._id}
              className={`btn btn-sm ${selectedCategory === cat._id ? 'btn-primary' : 'btn-soft btn-primary'}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <Coffee size={48} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-lg font-semibold text-base-content/60">No hay productos disponibles</h3>
              <p className="text-sm text-base-content/40 mt-1">Pronto tendremos novedades</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <figure className="px-4 pt-4">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-base-200 w-full flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Coffee size={48} className="opacity-20 text-base-content" />
                    )}
                  </div>
                </figure>
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base-content">{product.name}</h3>
                    {product.featured && (
                      <span className="badge badge-soft badge-warning text-[10px] shrink-0">Destacado</span>
                    )}
                  </div>
                  <p className="text-xs text-base-content/50 line-clamp-2 min-h-[2rem]">{product.description || '—'}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-base-content/40">{catMap[product.categoryId?._id || product.categoryId] || '—'}</span>
                    <span className="font-bold text-primary">{formatCurrency(product.price?.M || product.price || 0)}</span>
                  </div>
                  {product.price?.S && product.price?.L && (
                    <div className="flex gap-2 mt-2 text-[10px] text-base-content/40">
                      <span>S: {formatCurrency(product.price.S)}</span>
                      <span>M: {formatCurrency(product.price.M)}</span>
                      <span>L: {formatCurrency(product.price.L)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="card bg-base-100 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <figure className="px-6 pt-6">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-base-200 w-full flex items-center justify-center">
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <Coffee size={64} className="opacity-20 text-base-content" />
                )}
              </div>
            </figure>
            <div className="card-body px-6 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-base-content">{selectedProduct.name}</h2>
                  <p className="text-sm text-base-content/50 mt-1">{catMap[selectedProduct.categoryId?._id || selectedProduct.categoryId] || '—'}</p>
                </div>
                {selectedProduct.featured && (
                  <span className="badge badge-warning text-xs">Destacado</span>
                )}
              </div>
              {selectedProduct.description && (
                <p className="text-sm text-base-content/60 mt-3">{selectedProduct.description}</p>
              )}
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-base-content/60">Precios</p>
                <div className="grid grid-cols-3 gap-3">
                  {SIZES.map((s) => (
                    <div key={s} className={`text-center p-3 rounded-xl border ${selectedProduct.price?.[s] ? 'border-primary/20 bg-primary/5' : 'border-base-200 opacity-30'}`}>
                      <p className="text-xs font-medium text-base-content/40">{s}</p>
                      <p className="text-sm font-bold text-primary">{selectedProduct.price?.[s] ? formatCurrency(selectedProduct.price[s]) : '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary w-full mt-6" onClick={() => setSelectedProduct(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;

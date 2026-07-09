import { useState, useEffect } from 'react';
import { getProducts } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { formatCurrency } from '../../utils/formatters';
import { Coffee, Search } from 'lucide-react';

function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (prodRes.ok) setProducts(prodRes.data);
        if (catRes.ok) setCategories(catRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory ||
      p.categoryId?._id === activeCategory ||
      p.categoryId === activeCategory;
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Menú Digital</h1>
          <p className="text-sm text-base-content/60 mt-1">Explora nuestra variedad de productos</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              className="input input-bordered w-full pl-9"
              placeholder="Buscar en el menú…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              className={`btn btn-sm whitespace-nowrap rounded-full ${!activeCategory ? 'btn-primary' : 'btn-soft'}`}
              onClick={() => setActiveCategory('')}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`btn btn-sm whitespace-nowrap rounded-full ${activeCategory === cat._id ? 'btn-primary' : 'btn-soft'}`}
                onClick={() => setActiveCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body items-center py-16 text-center">
              <Coffee size={48} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-lg font-semibold text-base-content">Sin resultados</h3>
              <p className="text-sm text-base-content/40">Intenta con otra búsqueda o categoría</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => {
              const mainPrice = p.price?.M || p.price?.S || p.price?.L || 0;
              return (
                <div
                  key={p._id}
                  className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <figure className="h-40 bg-base-200 flex items-center justify-center overflow-hidden rounded-t-xl relative">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-base-content/20">
                        <Coffee size={40} />
                        <span className="text-[10px] font-medium">Sin imagen</span>
                      </div>
                    )}
                    {p.featured && (
                      <span className="absolute top-2 right-2 badge badge-soft badge-warning text-[10px] font-semibold shadow-xs">
                        Destacado
                      </span>
                    )}
                  </figure>
                  <div className="card-body p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm text-base-content truncate">{p.name}</h3>
                        <span className="text-[11px] text-base-content/40 mt-0.5 block">
                          {catMap[p.categoryId?._id || p.categoryId] || '—'}
                        </span>
                      </div>
                      <p className="text-base font-bold text-primary shrink-0">{formatCurrency(mainPrice)}</p>
                    </div>
                    {p.description && (
                      <p className="text-xs text-base-content/50 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                    )}
                    {(p.price?.S || p.price?.L) && (
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-base-200 text-[11px] text-base-content/40">
                        {p.price?.S && <span>S {formatCurrency(p.price.S)}</span>}
                        {p.price?.M && <span className="font-medium text-base-content/60">M {formatCurrency(p.price.M)}</span>}
                        {p.price?.L && <span>L {formatCurrency(p.price.L)}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuPage;

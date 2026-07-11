import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getTables } from '../../api/tableApi';
import { getProducts } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { getCustomers } from '../../api/customerApi';
import { createOrder } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus, Trash2, Coffee, ShoppingCart, ArrowLeft } from 'lucide-react';

const SIZES = ['S', 'M', 'L'];
const MILK_OPTIONS = [
  { value: 'whole', label: 'Entera' },
  { value: 'lactose-free', label: 'Sin lactosa' },
  { value: 'plant-based', label: 'Vegetal' },
  { value: 'none', label: 'Sin leche' },
];
const TEMP_OPTIONS = [
  { value: 'hot', label: 'Caliente' },
  { value: 'cold', label: 'Fría' },
];

function CreateOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [customizing, setCustomizing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tRes, pRes, cRes, cuRes] = await Promise.all([
          getTables(),
          getProducts(),
          getCategories(),
          getCustomers(),
        ]);
        if (tRes.ok) setTables(tRes.data);
        if (pRes.ok) setProducts(pRes.data);
        if (cRes.ok) setCategories(cRes.data);
        if (cuRes.ok) setCustomers(cuRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tableParam = searchParams.get('tableId');
  useEffect(() => {
    if (tableParam && tables.length > 0) {
      setSelectedTable(tableParam);
    }
  }, [tableParam, tables]);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.categoryId?._id === filterCat || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  const catMap = {};
  categories.forEach((c) => { catMap[c._id] = c.name; });

  const addToCart = (product, customization) => {
    const price = product.price?.[customization.size || 'M'] || product.price?.M || 0;
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product._id &&
          item.size === customization.size &&
          item.milk === customization.milk &&
          item.temperature === customization.temperature &&
          item.note === customization.note
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        quantity: 1,
        price,
        size: customization.size,
        milk: customization.milk,
        temperature: customization.temperature,
        note: customization.note,
      }];
    });
    setCustomizing(null);
  };

  const updateQty = (index, delta) => {
    setCart((prev) => {
      const next = [...prev];
      const item = { ...next[index] };
      item.quantity = Math.max(1, item.quantity + delta);
      next[index] = item;
      return next;
    });
  };

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const currentTable = tables.find(t => t._id === selectedTable);
  const selectedCustomerData = customers.find((c) => c._id === selectedCustomer) || currentTable?.currentCustomer || null;

  useEffect(() => {
    if (!selectedTable) {
      setSelectedCustomer('');
      return;
    }

    const tableCustomerId = currentTable?.currentCustomer?._id || currentTable?.currentCustomer || '';
    if (tableCustomerId) {
      setSelectedCustomer(tableCustomerId);
    } else {
      setSelectedCustomer('');
    }
  }, [selectedTable, currentTable?.currentCustomer]);

  const getDiscountPercent = (customer) => {
    const pts = customer?.lifetimePoints ?? 0;
    if (pts >= 600) return 0.15;
    if (pts >= 300) return 0.10;
    if (pts >= 100) return 0.05;
    return 0;
  };

  const discountPercent = getDiscountPercent(selectedCustomerData);

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountValue = rawSubtotal * discountPercent;
  const subtotal = rawSubtotal - discountValue;
  const taxes = subtotal * 0.19;
  const total = subtotal + taxes;

  const handleSubmit = async () => {
    setError('');
    if (!selectedTable) { setError('Selecciona una mesa'); return; }
    if (cart.length === 0) { setError('Agrega al menos un producto'); return; }

    const productsData = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      customization: { size: item.size, milk: item.milk, temperature: item.temperature },
      note: item.note || '',
    }));

    const payload = {
      tableId: selectedTable,
      waiterId: user.id,
      products: productsData,
      customerId: selectedCustomer || null,
      subtotal: Math.round(rawSubtotal),
      discount: Math.round(discountValue),
      taxes: Math.round(taxes),
      total: Math.round(total),
    };

    setSaving(true);
    try {
      const res = await createOrder(payload);
      if (res.ok) {
        toast.success('Pedido creado exitosamente');
        navigate(`/orders/${res.data._id}`);
      } else {
        setError(res.msg || 'Error al crear el pedido');
        toast.error(res.msg || 'Error al crear el pedido');
      }
    } catch {
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button className="btn btn-ghost btn-sm btn-square" onClick={() => navigate('/orders')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-base-content">Nuevo Pedido</h1>
            <p className="text-sm text-base-content/60">Selecciona productos y personalízalos</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <label className="label">
                  <span className="label-text font-medium">Mesa *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                >
                  <option value="">Seleccionar mesa</option>
                  {tables
                    .filter((t) => t.status === 'free' || t.status === 'occupied')
                    .map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name || `Mesa ${t.tableNumber}`} ({t.status === 'free' ? 'Disponible' : 'Ocupada'})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <label className="label">
                  <span className="label-text font-medium">Cliente</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Sin cliente</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} {customer.email ? `- ${customer.email}` : ''} ({customer.points ?? 0} pts)
                    </option>
                  ))}
                </select>
                {selectedCustomerData && (
                  <div className="mt-3 space-y-1 text-xs text-base-content/60">
                    <div className="flex justify-between">
                      <span>Puntos acumulados</span>
                      <span><strong className="text-primary">{selectedCustomerData.lifetimePoints ?? 0}</strong> pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Puntos disponibles</span>
                      <span><strong className="text-base-content">{selectedCustomerData.points ?? 0}</strong> pts</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-success font-medium pt-1 border-t border-base-200 mt-1">
                        <span>Descuento por fidelidad</span>
                        <span><strong>{(discountPercent * 100).toFixed(0)}%</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

            {filteredProducts.length === 0 ? (
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body items-center py-12 text-center">
                  <Coffee size={40} className="mb-3 opacity-30 mx-auto" />
                  <p className="text-sm text-base-content/50">No se encontraron productos</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredProducts.map((p) => {
                  const price = p.price?.M || 0;
                  return (
                    <div key={p._id} className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary transition-colors">
                      <div className="card-body p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm text-base-content truncate">{p.name}</h3>
                          <span className="text-sm font-bold text-primary whitespace-nowrap">
                            {formatCurrency(price)}
                          </span>
                        </div>
                        {p.description && (
                          <p className="text-xs text-base-content/50 line-clamp-1">{p.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] text-base-content/40">
                            {catMap[p.categoryId?._id || p.categoryId] || '—'}
                          </span>
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => setCustomizing(customizing?._id === p._id ? null : p)}
                          >
                            {customizing?._id === p._id ? 'Cerrar' : 'Agregar'}
                          </button>
                        </div>

                        {customizing?._id === p._id && (
                          <div className="mt-3 pt-3 border-t border-base-200 space-y-3">
                            <div>
                              <label className="label-text text-xs font-medium mb-1 block">Tamaño</label>
                              <div className="flex gap-2">
                                {SIZES.map((s) => {
                                  const sizePrice = p.price?.[s] || p.price?.M || 0;
                                  const selected = customizing.size === s || (!customizing.size && s === 'M');
                                  return (
                                    <button
                                      key={s}
                                      className={`btn btn-xs flex-1 ${selected ? 'btn-primary' : 'btn-outline'}`}
                                      onClick={() => {
                                        setCustomizing((prev) => {
                                          const next = { ...prev, size: s };
                                          if (!next.milk) next.milk = 'none';
                                          if (!next.temperature) next.temperature = 'hot';
                                          return next;
                                        });
                                      }}
                                    >
                                      {s} {formatCurrency(sizePrice)}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className="label-text text-xs font-medium mb-1 block">Leche</label>
                              <div className="flex flex-wrap gap-1">
                                {MILK_OPTIONS.map((m) => {
                                  const selected = (customizing.milk || 'none') === m.value;
                                  return (
                                    <button
                                      key={m.value}
                                      className={`btn btn-xs ${selected ? 'btn-primary' : 'btn-outline'}`}
                                      onClick={() => setCustomizing((prev) => ({ ...prev, milk: m.value }))}
                                    >
                                      {m.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className="label-text text-xs font-medium mb-1 block">Temperatura</label>
                              <div className="flex gap-2">
                                {TEMP_OPTIONS.map((t) => {
                                  const selected = (customizing.temperature || 'hot') === t.value;
                                  return (
                                    <button
                                      key={t.value}
                                      className={`btn btn-xs flex-1 ${selected ? 'btn-primary' : 'btn-outline'}`}
                                      onClick={() => setCustomizing((prev) => ({ ...prev, temperature: t.value }))}
                                    >
                                      {t.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className="label-text text-xs font-medium mb-1 block">Nota (opcional)</label>
                              <input
                                className="input input-bordered input-xs w-full"
                                placeholder="Ej: sin azúcar, extra espuma…"
                                value={customizing.note || ''}
                                onChange={(e) => setCustomizing((prev) => ({ ...prev, note: e.target.value }))}
                              />
                            </div>

                            <button
                              className="btn btn-primary btn-sm w-full mt-2"
                              onClick={() => {
                                const cust = {
                                  size: customizing.size || 'M',
                                  milk: customizing.milk || 'none',
                                  temperature: customizing.temperature || 'hot',
                                  note: customizing.note || '',
                                };
                                addToCart(p, cust);
                              }}
                            >
                              <Plus size={14} /> Agregar al pedido
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <div className="card bg-base-100 shadow-sm border border-base-200 sticky top-24">
              <div className="card-body p-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart size={18} className="text-primary" />
                  <h2 className="text-lg font-bold text-base-content">Pedido</h2>
                  <span className="badge badge-soft badge-primary ml-auto">{cart.length} productos</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center">
                    <Coffee size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm text-base-content/40">Selecciona productos para agregar</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-base-200/50 rounded-lg p-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-base-content truncate">{item.name}</h4>
                            <button className="btn btn-ghost btn-xs btn-square text-error" onClick={() => removeItem(index)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <p className="text-[11px] text-base-content/40 mt-0.5">
                            {item.size} · {MILK_OPTIONS.find((m) => m.value === item.milk)?.label || item.milk} · {TEMP_OPTIONS.find((t) => t.value === item.temperature)?.label || item.temperature}
                            {item.note ? ` · "${item.note}"` : ''}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <button className="btn btn-ghost btn-xs btn-square" onClick={() => updateQty(index, -1)} disabled={item.quantity <= 1}>
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <button className="btn btn-ghost btn-xs btn-square" onClick={() => updateQty(index, 1)}>
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-primary">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <>
                    <hr className="my-4 border-base-200" />
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-base-content/60">
                        <span>Subtotal</span>
                        <span>{formatCurrency(rawSubtotal)}</span>
                      </div>
                      {discountValue > 0 && (
                        <div className="flex justify-between text-success font-medium">
                          <span>Descuento Fidelidad ({(discountPercent * 100).toFixed(0)}%)</span>
                          <span>-{formatCurrency(discountValue)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base-content/60">
                        <span>IVA 19%</span>
                        <span>{formatCurrency(taxes)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-base-content pt-1">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </>
                )}

                {error && <div className="bg-red-500 text-white rounded-lg py-2 text-sm mt-4">{error}</div>}

                <button
                  className="btn btn-primary w-full mt-4"
                  disabled={saving || cart.length === 0 || !selectedTable}
                  onClick={handleSubmit}
                >
                  {saving ? (
                    <><span className="loading loading-spinner loading-xs"></span> Creando pedido...</>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;

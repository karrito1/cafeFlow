import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getOrders } from "../../api/orderApi";
import { createPayment } from "../../api/paymentApi";

function PaymentModal({ open, onClose }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [orderSelected, setOrderSelected] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [change, setChange] = useState(0);

  // Toast (reemplaza alert())
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({ type, message });

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Limpiar timeout al desmontar el modal
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Cargar pedidos
  useEffect(() => {
    if (!open) return;

    const loadOrders = async () => {
      try {
        const response = await getOrders();

        if (response.ok) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      }
    };

    loadOrders();
  }, [open]);

  // Pedido seleccionado
  useEffect(() => {
    const order = orders.find((o) => o._id === selectedOrder);
    setOrderSelected(order || null);
  }, [selectedOrder, orders]);

  // Calcular cambio
  useEffect(() => {
    const total = Number(orderSelected?.total || 0);
    const recibido = Number(amountReceived || 0);

    if (recibido >= total) {
      setChange(recibido - total);
    } else {
      setChange(0);
    }
  }, [amountReceived, orderSelected]);

  // Guardar pago
  const handleSave = async () => {
    if (!selectedOrder) {
      showToast("Seleccione un pedido.", "error");
      return;
    }

    const total = Number(orderSelected?.total || 0);

    if (paymentMethod === "cash" && Number(amountReceived) < total) {
      showToast("El valor recibido es menor al total.", "error");
      return;
    }

    try {
      const response = await createPayment({
        orderId: selectedOrder,
        paymentMethod,
        amount: total,
        change,
      });

      if (response.ok) {
        showToast(response.msg || "Pago registrado correctamente.", "success");

        setSelectedOrder("");
        setOrderSelected(null);
        setPaymentMethod("cash");
        setAmountReceived("");
        setChange(0);

        // Dar tiempo a que se vea el toast antes de cerrar el modal
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        showToast(response.msg, "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error al registrar el pago.", "error");
    }
  };

  if (!open) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl">Registrar Pago</h3>

          <button className="btn btn-sm btn-circle" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pedido */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pedido</span>
            </label>

            <select
              className="select select-bordered"
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
            >
              <option value="">Seleccione un pedido</option>

              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  Pedido #{order._id.slice(-5)} - Mesa{" "}
                  {order.tableId?.tableNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Cliente */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Cliente</span>
            </label>

            <input
              type="text"
              className="input input-bordered"
              disabled
              value={orderSelected?.customerId?.name || ""}
            />
          </div>

          {/* Método de pago */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Método de pago</span>
            </label>

            <select
              className="select select-bordered"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="mixed">Mixto</option>
            </select>
          </div>

          {/* Total */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Total</span>
            </label>

            <input
              type="text"
              className="input input-bordered"
              disabled
              value={formatCurrency(orderSelected?.total)}
            />
          </div>

          {/* Valor recibido */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Valor recibido</span>
            </label>

            <input
              type="number"
              className="input input-bordered"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              placeholder="Ingrese el valor recibido"
            />
          </div>

          {/* Cambio */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Cambio</span>
            </label>

            <input
              type="text"
              className="input input-bordered"
              disabled
              value={formatCurrency(change)}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={handleSave}>
            Registrar Pago
          </button>
        </div>
      </div>

      {/* Toast (reemplaza alert()) */}
      {toast && (
        <div className="toast toast-top toast-end z-[100]">
          <div
            className={`alert border-0 text-white shadow-lg ${
              toast.type === "error"
                ? "bg-[#B45309]" // ámbar oscuro para errores
                : "bg-[#3F2D20]" // marrón oscuro (mismo tono que "Nuevo Pago") para éxito
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default PaymentModal;

import { CreditCard, Plus, Search, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { getPayments } from "../../api/paymentApi";
import PaymentModal from "../../pages/payments/PaymentModal";

function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      const response = await getPayments();

      if (response.ok) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error("Error al cargar pagos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pagos</h1>
          <p className="text-gray-500">
            Administra los pagos realizados por los clientes.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Nuevo Pago
        </button>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <DollarSign className="text-success" size={32} />
            <h2 className="card-title">
              $
              {payments.reduce(
                (acc, payment) => acc + payment.amount,
                0
              )}
            </h2>
            <p>Total Recaudado</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <CreditCard className="text-primary" size={32} />
            <h2 className="card-title">
              {payments.length}
            </h2>
            <p>Pagos realizados</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <CreditCard className="text-warning" size={32} />
            <h2 className="card-title">
              {
                payments.filter(
                  (p) => p.status === "pending"
                ).length
              }
            </h2>
            <p>Pendientes</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <CreditCard className="text-error" size={32} />
            <h2 className="card-title">
              {
                payments.filter(
                  (p) => p.status === "failed"
                ).length
              }
            </h2>
            <p>Fallidos</p>
          </div>
        </div>

      </div>

      {/* Buscador */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">

          <div className="flex gap-4">

            <label className="input input-bordered flex items-center gap-2 flex-1">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar..."
              />
            </label>

            <select className="select select-bordered">
              <option>Todos</option>
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>Transferencia</option>
              <option>Mixto</option>
            </select>

          </div>

        </div>
      </div>

      {/* Tabla */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">

          <div className="overflow-x-auto">

            <table className="table">

              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Método</th>
                  <th>Total</th>
                  <th>Cambio</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10"
                    >
                      Cargando pagos...
                    </td>
                  </tr>

                ) : payments.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10"
                    >
                      No hay pagos registrados.
                    </td>
                  </tr>

                ) : (

                  payments.map((payment) => (

                    <tr key={payment._id}>

                      <td>
                        {payment.orderId?._id?.slice(-5)}
                      </td>

                      <td>
                        {payment.paymentMethod}
                      </td>

                      <td>
                        ${payment.amount}
                      </td>

                      <td>
                        ${payment.change}
                      </td>

                      <td>
                        {payment.status}
                      </td>

                      <td>
                        {new Date(
                          payment.paymentDate
                        ).toLocaleDateString()}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>

      <PaymentModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadPayments();
        }}
      />

    </div>
  );
}

export default PaymentPage;
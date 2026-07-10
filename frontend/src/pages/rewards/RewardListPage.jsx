import { Gift, Star, Award, Zap } from 'lucide-react';

const TIERS = [
  { min: 600, label: '15% de descuento', icon: Zap, desc: 'Clientes recurrentes con más de 600 pts históricos' },
  { min: 300, label: '10% de descuento', icon: Award, desc: 'Clientes frecuentes con más de 300 pts históricos' },
  { min: 100, label: '5% de descuento', icon: Star, desc: 'Clientes habituales con más de 100 pts históricos' },
  { min: 0, label: 'Sin descuento', icon: Gift, desc: 'Menos de 100 pts históricos' },
];

function RewardListPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Programa de Fidelidad</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Los clientes acumulan 1 punto por cada $500 COP en compras. Al alcanzar ciertos puntajes, obtienen descuentos automáticos.
          </p>
        </div>

        <div className="grid gap-4">
          {TIERS.map((tier) => (
            <div key={tier.min} className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-5 flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <tier.icon size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content">{tier.label}</h3>
                  <p className="text-sm text-base-content/50">{tier.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-base-content/40">
                    {tier.min > 0 ? `${tier.min}+ pts` : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <h3 className="font-semibold text-base-content mb-2">¿Cómo funciona?</h3>
            <ol className="text-sm text-base-content/60 space-y-2 list-decimal list-inside">
              <li>El cliente acumula puntos automáticamente al pagar sus pedidos</li>
              <li>Al llegar a 100 pts históricos, obtiene 5% de descuento en todos sus pedidos</li>
              <li>Al llegar a 300 pts, el descuento sube a 10%</li>
              <li>Al llegar a 600 pts, el descuento sube a 15%</li>
              <li>El descuento se aplica automáticamente al seleccionar el cliente en un pedido</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardListPage;

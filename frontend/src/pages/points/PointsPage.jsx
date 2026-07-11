import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMe } from "../../api/authApi";
import { Trophy, Star, TrendingUp, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LEVEL_CONFIG = {
  bronze: {
    label: "Bronce",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "🪙",
    next: "Plata",
    nextAt: 500,
  },
  silver: {
    label: "Plata",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: "🥈",
    next: "Oro",
    nextAt: 2000,
  },
  gold: {
    label: "Oro",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "🏆",
    next: null,
    nextAt: null,
  },
};

const DISCOUNT_RULES = [
  { min: 100, percent: 5, label: "100+ puntos" },
  { min: 300, percent: 10, label: "300+ puntos" },
  { min: 600, percent: 15, label: "600+ puntos" },
];

function PointsPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const res = await getMe();
        if (res.ok) {
          refreshUser(res.data);
        }
      } catch {
        // silent — keep JWT data
      } finally {
        setLoading(false);
      }
    };
    fetchFreshData();
  }, []);

  const lifetimePoints = user?.lifetimePoints ?? 0;
  const currentPoints = user?.points ?? 0;
  const level = user?.level || "bronze";
  const config = LEVEL_CONFIG[level];

  const currentDiscount =
    lifetimePoints >= 600 ? 15 : lifetimePoints >= 300 ? 10 : lifetimePoints >= 100 ? 5 : 0;

  const progressToNext =
    config.nextAt !== null
      ? Math.min(100, (lifetimePoints / config.nextAt) * 100)
      : 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Mis Puntos</h1>
          <p className="text-sm text-base-content/60">
            Acumula puntos y obtén descuentos
          </p>
        </div>

        {/* Nivel actual */}
        <div
          className={`card ${config.bg} border ${config.border} shadow-sm`}
        >
          <div className="card-body px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{config.icon}</div>
              <div className="flex-1">
                <h2 className={`text-xl font-bold ${config.color}`}>
                  Nivel {config.label}
                </h2>
                {config.next && (
                  <p className="text-sm text-base-content/60 mt-1">
                    {lifetimePoints} / {config.nextAt} puntos para nivel{" "}
                    {config.next}
                  </p>
                )}
                {!config.next && (
                  <p className="text-sm text-base-content/60 mt-1">
                    Nivel máximo alcanzado
                  </p>
                )}
              </div>
            </div>
            {config.nextAt !== null && (
              <div className="mt-4">
                <div className="w-full bg-white/50 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tarjetas de puntos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4 items-center text-center">
              <Star size={24} className="text-primary mb-1" />
              <p className="text-2xl font-bold text-primary">{currentPoints}</p>
              <p className="text-xs text-base-content/60">Puntos disponibles</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4 items-center text-center">
              <TrendingUp size={24} className="text-primary mb-1" />
              <p className="text-2xl font-bold text-primary">
                {lifetimePoints}
              </p>
              <p className="text-xs text-base-content/60">
                Puntos históricos
              </p>
            </div>
          </div>
        </div>

        {/* Descuento actual */}
        {currentDiscount > 0 && (
          <div className="card bg-success/10 border border-success/20 shadow-sm">
            <div className="card-body px-6 py-4">
              <div className="flex items-center gap-3">
                <Gift size={20} className="text-success" />
                <div>
                  <p className="font-semibold text-success">
                    Descuento activo: {currentDiscount}%
                  </p>
                  <p className="text-xs text-base-content/60">
                    Se aplica automáticamente en tus pedidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reglas de descuento */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body px-6 py-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={18} className="text-primary" />
              <h3 className="font-semibold text-base-content">
                Cómo ganar descuentos
              </h3>
            </div>
            <div className="space-y-3">
              {DISCOUNT_RULES.map((rule) => {
                const isActive = lifetimePoints >= rule.min;
                return (
                  <div
                    key={rule.min}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isActive
                        ? "bg-success/10 border border-success/20"
                        : "bg-base-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive
                            ? "bg-success text-white"
                            : "bg-base-300 text-base-content/50"
                        }`}
                      >
                        {isActive ? "✓" : rule.min}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-base-content">
                          {rule.label}
                        </p>
                        <p className="text-xs text-base-content/50">
                          Descuento del {rule.percent}%
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="badge badge-soft badge-success text-xs">
                        Activo
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cómo ganar puntos */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body px-6 py-6">
            <h3 className="font-semibold text-base-content mb-3">
              ¿Cómo ganar puntos?
            </h3>
            <p className="text-sm text-base-content/60">
              Ganás <strong className="text-primary">1 punto por cada $500 COP</strong> que
              gastés en la cafetería. Tus puntos se acumulan automáticamente
              cuando iniciás sesión como cliente y realizás pedidos.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/menu"
          className="btn btn-primary w-full gap-2"
        >
          Ver Menú <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default PointsPage;

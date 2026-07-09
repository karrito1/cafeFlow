import { useEffect, useState } from "react";
import { Gift, Star, Coffee } from "lucide-react";
import { getRewards, claimReward } from "../../api/rewardApi";

function RedeemRewardPage() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  // Temporal: reemplazar por el cliente autenticado
  const customerId = "ID_DEL_CLIENTE";

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const response = await getRewards();

      console.log("Respuesta API:", response);

      setRewards(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (rewardId) => {
    try {
      setRedeeming(rewardId);

      await claimReward(customerId, rewardId);

      alert("Recompensa canjeada correctamente");
    } catch (error) {
      alert(
        error.response?.data?.msg || "No fue posible canjear la recompensa",
      );
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Gift className="text-warning" size={40} />
            Recompensas
          </h1>

          <p className="text-base-content/70 mt-2">
            Canjea tus puntos por bebidas y productos exclusivos.
          </p>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Star fill="currentColor" />
            </div>

            <div className="stat-title">Tus puntos</div>

            <div className="stat-value text-warning">250</div>
          </div>
        </div>
      </div>

      {rewards.length === 0 ? (
        <div className="hero bg-base-100 rounded-xl shadow-lg">
          <div className="hero-content text-center">
            <div>
              <Gift size={80} className="mx-auto text-warning mb-4" />

              <h2 className="text-3xl font-bold">
                No hay recompensas disponibles
              </h2>

              <p className="text-base-content/70 mt-2">
                El administrador aún no ha creado recompensas.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rewards.map((reward) => (
            <div
              key={reward._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300"
            >
              <figure className="bg-warning/10 py-10">
                {reward.image ? (
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="w-28 h-28 object-contain"
                  />
                ) : (
                  <Coffee size={70} className="text-warning" />
                )}
              </figure>

              <div className="card-body">
                <h2 className="card-title text-xl">{reward.name}</h2>

                <p className="text-base-content/70">{reward.description}</p>

                <div className="divider my-2"></div>

                <div className="flex justify-between items-center">
                  <span className="badge badge-warning badge-lg gap-2">
                    <Star size={15} fill="currentColor" />
                    {reward.pointsRequired} pts
                  </span>

                  <span className="text-success font-bold">Disponible</span>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button
                    className="btn btn-warning"
                    disabled={redeeming === reward._id}
                    onClick={() => handleClaim(reward._id)}
                  >
                    {redeeming === reward._id ? "Canjeando..." : "Canjear"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RedeemRewardPage;

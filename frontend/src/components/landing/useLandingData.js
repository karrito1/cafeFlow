import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const mapId = (item) => ({ ...item, id: item._id ?? item.id });

export const useLandingData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customersCount, setCustomersCount] = useState(2847);
  const [rewardsCount, setRewardsCount] = useState(1234);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, categoriesRes, customersRes, rewardsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/customers`),
          fetch(`${API_BASE_URL}/rewards`)
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          const rawProducts = Array.isArray(data) ? data : data.data || [];
          setProducts(rawProducts.map(mapId));
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          const rawCategories = Array.isArray(data) ? data : data.data || [];
          setCategories(rawCategories.map(mapId));
        }

        if (customersRes.ok) {
          const data = await customersRes.json();
          const customers = Array.isArray(data) ? data : data.customers || [];
          setCustomersCount(customers.length);
        }

        if (rewardsRes.ok) {
          const data = await rewardsRes.json();
          const activeRewards = Array.isArray(data) ? data : data.rewards || [];
          setRewardsCount(activeRewards.length);
          setRewards(activeRewards);
        }
      } catch (err) {
        if (err.name === "TypeError") {
          setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, categories, loading, error, customersCount, rewardsCount, rewards };
};

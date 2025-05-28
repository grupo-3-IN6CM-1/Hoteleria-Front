// src/shared/hooks/useMyHotels.jsx
import { useState, useEffect } from "react";
import { getMyHotels } from "../../services/api";
import { message } from "antd";

export const useMyHotels = () => {
  const [hotels, setHotels]     = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    if (user.role !== "HOTEL_ADMIN") {
      return;
    }

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyHotels();
        if (res.error) throw res.e;
        setHotels(res.data.hotels);
      } catch (err) {
        setError(err);
        message.error("Error al cargar tus hoteles");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { hotels, isLoading, error };
};

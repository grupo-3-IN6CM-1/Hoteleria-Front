// src/shared/hooks/useMyReservations.jsx
import { useState, useEffect } from "react";
import { getMyReservations } from "../../services/api";
import { message } from "antd";

export const useMyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setLoading]         = useState(false);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user.role !== "HOTEL_ADMIN") return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getMyReservations();
        if (res.error) throw res.e;
        setReservations(res.data.reservations);
      } catch (err) {
        setError(err);
        message.error("Error al cargar reservaciones");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { reservations, isLoading, error };
};

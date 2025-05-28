// src/shared/hooks/useMyGuests.jsx
import { useState, useEffect } from "react";
import { getMyGuests }          from "../../services/api";
import { message }              from "antd";

export const useMyGuests = () => {
  const [guests, setGuests]   = useState([]);
  const [isLoading, setLoad]  = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user.role !== "HOTEL_ADMIN") return;

    const fetch = async () => {
      setLoad(true);
      try {
        const res = await getMyGuests();
        if (res.error) throw res.e;
        setGuests(res.data.guests);
      } catch (err) {
        setError(err);
        message.error("Error al cargar huéspedes");
      } finally {
        setLoad(false);
      }
    };

    fetch();
  }, []);

  return { guests, isLoading, error };
};

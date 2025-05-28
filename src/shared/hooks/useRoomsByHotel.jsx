import { useState, useEffect } from "react";
import { getRoomsByHotel } from "../../services/api";
import { message } from "antd";

export const useRoomsByHotel = (hotelId) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotelId) return;

    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getRoomsByHotel(hotelId);
        if (res.error) throw res.e;

        const raw = Array.isArray(res.data)
          ? res.data
          : res.data.rooms || [];

        setRooms(raw);
      } catch (err) {
        setError(err);
        message.error("Error al cargar habitaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  return { rooms, isLoading, error };
};

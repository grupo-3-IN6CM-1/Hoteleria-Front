import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

export const useRoomsByHotel = (hotelId) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotelId) return;

    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:3000/Hoteleria/v1/rooms/hotel/${hotelId}`);
        setRooms(response.data.rooms || []);
      } catch (err) {
        setError(err);
        message.error("Error al cargar las habitaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  return { rooms, isLoading, error };
};

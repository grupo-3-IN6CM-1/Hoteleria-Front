import { useEffect, useState } from "react";
import { getTopRooms, getTopHotels } from "../../services/api";

export const useCharts = () => {
  const [topRooms, setTopRooms] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const rooms = await getTopRooms();
        const hotels = await getTopHotels();

        if (rooms.error || hotels.error) throw new Error("Error al cargar");

        setTopRooms(rooms);
        setTopHotels(hotels);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  return {
    topRooms,
    topHotels,
    loading,
    error,
  };
};

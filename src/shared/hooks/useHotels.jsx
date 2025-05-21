import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

export const useHotels = (role, hotelAdminId) => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:3000/Hoteleria/v1/hotels");
        let data = res.data.hotels || res.data;

        if (role === "HOTEL_ADMIN" && hotelAdminId) {
          data = data.filter((hotel) => hotel._id === hotelAdminId);
        }

        setHotels(data);
      } catch (err) {
        setError(err);
        message.error("Error al cargar hoteles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [role, hotelAdminId]);

  return { hotels, isLoading, error };
};

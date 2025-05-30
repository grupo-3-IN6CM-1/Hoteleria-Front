import { useEffect, useState } from "react";
import { getClients } from "../../services/api";

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClients()
      .then((data) => {
        if (!data.error) {
          // Filtrar usuarios que tengan rol CLIENT y _id definido
          const validClients = data.filter(
            (user) => user.role === "CLIENT" && user._id
          );
          setClients(validClients);
        } else {
          setError(data.e);
        }
        setLoading(false);
      });
  }, []);

  return { clients, loading, error };
};

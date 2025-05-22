import { useState, useEffect } from "react";
import { getUsersByRole } from "../../services/api";

export const useAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      const res = await getUsersByRole("HOTEL_ADMIN");
      if (!res.error) {
        setAdmins(res.data?.users || res.data);
      } else {
        setError(res.e);
      }
      setLoading(false);
    };
    fetchAdmins();
  }, []);

  return { admins, loading, error };
};

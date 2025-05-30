// src/shared/hooks/useMyProfile.js
import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../services/api";

export const useMyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyProfile();
      if (!res.error) setUser(res.user || null);
      else setError("Error al cargar perfil");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateMyProfile(id, data);
      if (!res.error) {
        setUser(res.user);
        return { success: true };
      } else {
        setError(res.msg || "Error al actualizar perfil");
        return { success: false };
      }
    } catch {
      setError("Error inesperado");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { user, loading, error, updateProfile, fetchProfile };
};

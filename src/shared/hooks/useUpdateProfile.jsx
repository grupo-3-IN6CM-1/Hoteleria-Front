import { useState } from "react";
import { updateMyProfile } from "../../services/api"; // Ajusta la ruta según tu proyecto

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateMyProfile(id, data);
      if (res.error) {
        setError(res.e?.response?.data?.msg || "Error al actualizar perfil");
        return { success: false, error: res.error };
      }
      return { success: true, data: res.data };
    } catch (e) {
      setError("Error inesperado al actualizar perfil");
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};

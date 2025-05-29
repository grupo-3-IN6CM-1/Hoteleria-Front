// src/shared/hooks/useInvoice.jsx
import { useState } from "react";
import { createInvoice } from "../../services/api";
import { message } from "antd";

export const useInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  const generateInvoice = async (reservation) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        reservation: reservation._id,
        hotel: reservation.hotel._id,
        user: reservation.user._id,
        amount: reservation.totalPrice,
        servicesCharges: 0,
        total: reservation.totalPrice,
      };

      const res = await createInvoice(payload);

      if (res.error || !res.invoice) {
        throw new Error("No se pudo generar la factura");
      }

      setInvoice(res.invoice);
      return res.invoice;
    } catch (err) {
      console.error(err);
      message.error("Error al generar factura");
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    invoice,
    loading,
    error,
    generateInvoice,
  };
};

import { useState, useEffect } from "react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/api";  // Asegúrate de que la ruta sea correcta
import { message } from "antd";

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRooms();
      if (!response.error) {
        setRooms(response.data.rooms);  
      } else {
        setError(response.e);
        message.error("Error al cargar las habitaciones");
      }
    } catch (err) {
      setError(err);
      message.error("Error al cargar las habitaciones");
    } finally {
      setLoading(false);
    }
  };

  const createNewRoom = async (roomData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createRoom(roomData);
      if (!response.error) {
        setRooms((prevRooms) => [...prevRooms, response.data.room]);
        message.success("Habitación agregada exitosamente");
      } else {
        setError(response.e);
        message.error("Error al agregar la habitación");
      }
    } catch (err) {
      setError(err);
      message.error("Error al agregar la habitación");
    } finally {
      setLoading(false);
    }
  };

  const editExistingRoom = async (roomId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateRoom(roomId, updatedData);
      if (!response.error) {
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === roomId ? { ...room, ...response.data.room } : room
          )
        );
        message.success("Habitación actualizada exitosamente");
      } else {
        setError(response.e);
        message.error("Error al actualizar la habitación");
      }
    } catch (err) {
      setError(err);
      message.error("Error al actualizar la habitación");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingRoom = async (roomId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteRoom(roomId);
      if (!response.error) {
        setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
        message.success("Habitación eliminada exitosamente");
      } else {
        setError(response.e);
        message.error("Error al eliminar la habitación");
      }
    } catch (err) {
      setError(err);
      message.error("Error al eliminar la habitación");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    createRoom: createNewRoom,
    editRoom: editExistingRoom,
    deleteRoom: deleteExistingRoom,
  };
};

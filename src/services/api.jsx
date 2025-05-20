import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:3000/Hoteleria/v1/',
  timeout: 5000
});

apiClient.interceptors.request.use(config => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers['x-token'] = token;
    }
  }
  return config;
});

export const login = async(data) => {
  try {
    return await apiClient.post('/auth/login', data);
  } catch (e) {
    return { error: true, e };
  }
};

export const register = async(data) => {
  try {
    return await apiClient.post('/auth/register', data);
  } catch (e) {
    return { error: true, e };
  }
};

// HOTELS
export const getHotels    = () => apiClient.get('/hotels');
export const createHotel  = h  => apiClient.post('/hotels', h);
export const updateHotel  = (id, h) => apiClient.put(`/hotels/${id}`, h);
export const deleteHotel  = id => apiClient.delete(`/hotels/${id}`);

// ROOMS
export const getRooms     = () => apiClient.get('/rooms');
export const createRoom   = r  => apiClient.post('/rooms', r);
export const updateRoom   = (id, r) => apiClient.put(`/rooms/${id}`, r);
export const deleteRoom   = id => apiClient.delete(`/rooms/${id}`);

// RESERVATIONS
export const getReservations         = () => apiClient.get('/reservations');
export const createReservation       = r  => apiClient.post('/reservations', r);
export const updateReservationStatus = (id, status) =>
  apiClient.put(`/reservations/${id}/status`, { status });
export const deleteReservation       = id => apiClient.delete(`/reservations/${id}`);
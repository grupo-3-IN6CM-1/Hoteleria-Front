import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:3000/Hoteleria/v1/',
    timeout: 5000
})

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
        return await apiClient.post('/auth/login', data)
    } catch (e) {
        return{
            error: true,
            e
        }
    }
}

export const register = async(data) => {
    try {
        return await apiClient.post('/auth/register', data)
    } catch (e) {
        return{
            error: true,
            e
        }
    }
}

export const getUsersByRole = async (role) => {
  try {
    return await apiClient.get('/users', { params: { role } });
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const getHotels = async () => {
  try {
    return await apiClient.get('/hotels');
  } catch (e) {
    return {
      error: true,
      e
    };
  }
}

export const getHotelById = async (id) => {
  try {
    return await apiClient.get(`/hotels/${id}`);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
}

export const createHotel = async (hotelData) => {
  try {
    return await apiClient.post('/hotels', hotelData);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
}

export const updateHotel = async (id, hotelData) => {
  try {
    return await apiClient.put(`/hotels/${id}`, hotelData);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
}

export const deleteHotel = async (id) => {
  try {
    return await apiClient.delete(`/hotels/${id}`);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
}

export const getRooms = async () => {
  try {
    return await apiClient.get('/rooms');
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};


export const getRoomById = async (id) => {
  try {
    return await apiClient.get(`/rooms/${id}`);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const createRoom = async (roomData) => {
  try {
    return await apiClient.post('/rooms', roomData);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    return await apiClient.put(`/rooms/${id}`, roomData);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const deleteRoom = async (id) => {
  try {
    return await apiClient.delete(`/rooms/${id}`);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const getMyHotels = async () => {
  try {
    return await apiClient.get('/hotels/my');
  } catch (e) {
    return { error: true, e };
  }
};

export const getRoomsByHotel = async (hotelId) => {
  try {
    return await apiClient.get(`/rooms/hotel/${hotelId}`);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const getReservations = async () => {
  try {
    return await apiClient.get("/reservations");
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const getMyReservations = async () => {
  try {
    return await apiClient.get('/reservations/my');
  } catch (e) {
    return { error: true, e };
  }
};

export const getMyGuests = async () => {
  try {
    return await apiClient.get('/reservations/guests/my');
  } catch (e) {
    return { error: true, e };
  }
};

export const createReservation = async (reservationData) => {
  try {
    return await apiClient.post('/reservations', reservationData);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const getReservationsByUsername= async (username) => {
  try {
    return await apiClient.get(`/reservations/by-username?username=${username}`);
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const updateReservationStatus = async (id, status) => {
  try {
    return await apiClient.put(`/reservations/${id}/status`, { status });
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const getReservationsByAdmin = async (adminId) => {
  try {
    return await apiClient.get(`/reservations/by-admin/${adminId}`);
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

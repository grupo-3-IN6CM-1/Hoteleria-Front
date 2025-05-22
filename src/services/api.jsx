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


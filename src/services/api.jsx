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
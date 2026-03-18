import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Connection failed');
    }
};

export const register = async (firstName, lastName, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { firstName, lastName, email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Connection failed');
    }
};

export const resetPassword = async (email, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { email, newPassword });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Connection failed');
    }
};

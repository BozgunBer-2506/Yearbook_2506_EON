import axios from 'axios';

const API_URL = 'https://yearbook2506eon-production.up.railway.app/api/auth';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Connection failed');
    }
};

import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export async function getAllPersonasService() {
    const response = await axios.get(`${API_ENDPOINT}/personas/`, {
        withCredentials: true,
    });

    return response.data.data.personas;
};
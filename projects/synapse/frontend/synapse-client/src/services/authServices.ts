import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export async function registerService(formData: any) {
    try {
        const response = await axios.post(`${API_ENDPOINT}/auth/register` , formData , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};

export async function loginService(formData: any) {
    try {
        const response = await axios.post(`${API_ENDPOINT}/auth/login` , formData , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};

export async function logoutService() {
    try {
        const response = await axios.post(`${API_ENDPOINT}/auth/logout` , {} , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};

export async function getMeService() {
    try {
        const response = await axios.get(`${API_ENDPOINT}/auth/me` , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};
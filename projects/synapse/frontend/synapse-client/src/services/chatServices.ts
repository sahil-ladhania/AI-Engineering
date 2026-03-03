import axios from 'axios';

const API_ENDPOINT = import.meta.env.API_URL;

export async function sendMessageService(inputPrompt: any) {
    try {
        const response = await axios.post(`${API_ENDPOINT}/chat/message` , inputPrompt , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};

export async function streamMessageService() {
    try {
        const response = await axios.get(`${API_ENDPOINT}/chat/stream` , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};

export async function getHistoryService() {
    try {
        const response = await axios.get(`${API_ENDPOINT}/chat/history` , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log(error)
    }
};

export async function clearHistoryService() {
    try {
        const response = await axios.delete(`${API_ENDPOINT}/chat/history` , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};

export async function getUsageService() {
    try {
        const response = await axios.get(`${API_ENDPOINT}/chat/usage` , {
            withCredentials: true
        });
        console.log(response.data);
        return response.data;
    } 
    catch (error) {
        console.log(error)
    }
};
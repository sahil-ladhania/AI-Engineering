import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export async function createChatService(data: { title?: string }) {
    const response = await axios.post(`${API_ENDPOINT}/chat/`, data, {
        withCredentials: true,
    });

    return response.data;
};

export async function getChatsService() {
    const response = await axios.get(`${API_ENDPOINT}/chat/`, {
        withCredentials: true,
    });

    return response.data.data.chats;
}

export async function updateChatService(chatId: string, data: { title: string }) {
    const response = await axios.patch(`${API_ENDPOINT}/chat/${chatId}`, data, {
        withCredentials: true,
    });

    return response.data;
}

export async function deleteChatService(chatId: string) {
    const response = await axios.delete(`${API_ENDPOINT}/chat/${chatId}`, {
        withCredentials: true,
    });

    return response.data;
}

export async function getChatMessagesService(chatId: string) {
    const response = await axios.get(`${API_ENDPOINT}/chat/${chatId}/messages`, {
        withCredentials: true,
    });

    return response.data;
}

export async function getUsageService() {
    const response = await axios.get(`${API_ENDPOINT}/chat/usage`, {
        withCredentials: true,
    });

    return response.data;
}

export async function sendMessageService(chatId: string, data: { content: string }) {
    const response = await axios.post(`${API_ENDPOINT}/chat/${chatId}/message`, data, {
        withCredentials: true,
    });

    return response.data;
}

export async function streamMessageService(chatId: string, data: { content: string }) {
    const response = await axios.post(`${API_ENDPOINT}/chat/${chatId}/stream`, data, {
        withCredentials: true,
        responseType: 'stream',
    });

    return response.data;
}
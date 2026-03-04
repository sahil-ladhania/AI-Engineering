import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_API_URL;

export async function getChatsService() {
    const response = await axios.get(`${API_ENDPOINT}/chat/`, {
        withCredentials: true,
    });

    return response.data.data.chats;
}

export async function getUsageService() {
    const response = await axios.get(`${API_ENDPOINT}/chat/usage`, {
        withCredentials: true,
    });

    return response.data.data;
}

export async function createChatService(data: { message: string; personaId?: string; model?: string; temperature?: number; maxTokens?: number }) {
    const response = await fetch(`${API_ENDPOINT}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    return response;
};

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

export async function streamMessageService(chatId: string, data: { message: string }) {
    const response = await fetch(`${API_ENDPOINT}/chat/${chatId}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    return response;
}
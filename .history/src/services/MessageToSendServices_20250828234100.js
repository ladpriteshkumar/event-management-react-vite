const API_BASE = "https://event-management-api-arhha6fda2aqesdj.centralus-01.azurewebsites.net/MessageToSend";
//const API_BASE = "https://localhost:7111/MessageToSend";

export async function getMessages() {
    const response = await fetch(`${API_BASE}/GetMessages`);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json();
}

export async function getMessage(id) {
    const response = await fetch(`${API_BASE}/GetMessage/${id}`);
    if (!response.ok) throw new Error("Failed to fetch message");
    return response.json();
}

export async function addMessage(messageData) {
    const response = await fetch(`${API_BASE}/AddMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
    });
    if (!response.ok) throw new Error("Failed to add message");
    return response.json();
}

export async function updateMessage(id, messageData) {
    const response = await fetch(`${API_BASE}/UpdateMessage/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
    });
    if (!response.ok) throw new Error("Failed to update message");
    return response.json();
}

export async function deleteMessage(id) {
    const response = await fetch(`${API_BASE}/DeleteMessage/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete message");
    return response.json();
}

const messageService = {
    getMessage,
    getMessages,
    addMessage,
    updateMessage,
    deleteMessage,
};

export default messageService;
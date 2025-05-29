const API_BASE = "https://event-management-api-arhha6fda2aqesdj.centralus-01.azurewebsites.net/Event";

export async function getEvents() {
    const response = await fetch(`${API_BASE}/GetEvents`);
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
}

export async function addEvent(eventData) {
    const response = await fetch(`${API_BASE}/AddEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error("Failed to add event");
    return response.json();
}

export async function updateEvent(id, eventData) {
    const response = await fetch(`${API_BASE}/UpdateEvent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error("Failed to update event");
    return response.json();
}

export async function deleteEvent(id) {
    const response = await fetch(`${API_BASE}/DeleteEvent/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete event");
    return response.json();
}

const eventService = {
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
};

export default eventService;
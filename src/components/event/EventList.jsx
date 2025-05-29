import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import EventService from "../../services/EventServices.js";
import "./EventList.css";

const EventList = forwardRef(({ onEdit }, ref) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data =  await EventService.getEvents();;
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await EventService.deleteEvent(eventId);
            fetchEvents();
        } catch (error) {
            alert(error.message);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshEvents: fetchEvents
    }));

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <>
            <h2>Event List</h2>
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>Loading...</td>
                        </tr>
                    ) : events.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>No events found.</td>
                        </tr>
                    ) : (
                        events.map((event, idx) => (
                            <tr key={event.id || idx}>
                                <td>{event.name}</td>
                                <td>{event.date}</td>
                                <td>{event.location}</td>
                                <td>{event.description}</td>
                                <td>
                                    <button
                                        style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", marginRight: "4px" }}
                                        onClick={() => onEdit(event)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
});

export default EventList;
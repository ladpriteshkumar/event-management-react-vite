import React, { useState } from "react";
import "./CreateEvent.css";

const CreateEvent = ({ onCreate, show = true, onToggle }) => {
    const [form, setForm] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onCreate) onCreate(form);
        setForm({ name: "", date: "", location: "", description: "" });
        if (onToggle) onToggle(); // Optionally hide after submit
    };

    if (!show) {
        return (
            <button
            type="button"
            onClick={onToggle}
            style={{  width: "200px" }}
            >
            Create Event
            </button>
        );
    }

    return (
        <div className="create-event-container">
        
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Event Name:
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Location:
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </label>
                </div>
                <button type="submit">Create Event</button>
                <button type="button" onClick={onToggle} style={{ marginLeft: "1rem" }}>
                    Cancel</button>
            </form>
        </div>
    );
};

export default CreateEvent;
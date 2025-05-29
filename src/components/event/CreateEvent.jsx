import React, { useState, useEffect } from "react";
import "./CreateEvent.css";
import GooglePlaceAutocomplete from "../googlePlaceApi/PlaceAutocompleteElement";

const CreateEvent = ({ onCreate, onUpdate, show = true, onToggle, editEvent }) => {
    const [form, setForm] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
    });

    useEffect(() => {
        if (editEvent) {
            setForm({
                name: editEvent.name || "",
                date: editEvent.date || "",
                location: editEvent.location || "",
                description: editEvent.description || "",
            });
        } else {
            setForm({
                name: "",
                date: "",
                location: "",
                description: "",
            });
        }
    }, [editEvent]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editEvent && onUpdate) {
            onUpdate(editEvent.id, form);
        } else if (onCreate) {
            onCreate(form);
        }
        setForm({ name: "", date: "", location: "", description: "" });
        if (onToggle) onToggle();
    };

    const handlePlaceSelected = (place) => {
        if (place && place.formatted_address) {
            setForm(f => ({ ...f, location: place.formatted_address }));
        }
    };

    if (!show) {
        return (
            <button
                type="button"
                onClick={onToggle}
                style={{ width: "200px" }}
            >
                {editEvent ? "Edit Event" : "Create Event"}
            </button>
        );
    }

    return (
        <div className="create-event-container">
            <h2>{editEvent ? "Update Event" : "Create Event"}</h2>
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
                        <GooglePlaceAutocomplete onPlaceSelected={handlePlaceSelected} />
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
                <button type="submit">
                    {editEvent ? "Update Event" : "Create Event"}
                </button>
                <button type="button" onClick={onToggle} style={{ marginLeft: "1rem" }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
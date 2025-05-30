import React, { useState, useEffect } from "react";
import "./CreateEvent.css";
import GooglePlaceAutocomplete from "../googlePlaceApi/PlaceAutocompleteElement";
import { usePreventEnterSubmit } from "../../customHooks/UsePreventEnterSubmit.js";
import EventService from "../../services/EventServices.js"; // Make sure this path is correct
import { useNavigate } from "react-router-dom"; // For navigation after creation

const CreateEvent = () => {
    const [form, setForm] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const preventEnterSubmit = usePreventEnterSubmit();
    const navigate = useNavigate();

    useEffect(() => {
        setForm({
            name: "",
            date: "",
            location: "",
            description: "",
        });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await EventService.addEvent(form);
            setForm({ name: "", date: "", location: "", description: "" });
            navigate("/send-invite"); // Redirect to event list or wherever you want
        } catch (error) {
            alert("Failed to create event: " + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceSelected = (place) => {
        if (place && place.formatted_address) {
            setForm(f => ({ ...f, location: place.formatted_address }));
        }
    };

    return (
        <div className="create-event-container">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}
                  onKeyDown={preventEnterSubmit}>
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
                        <GooglePlaceAutocomplete
                            onPlaceSelected={handlePlaceSelected}
                            value={form.location}
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
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Event"}
                    </button>
                    <button
                        type="button"
                        style={{ marginLeft: "8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", cursor: "pointer" }}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
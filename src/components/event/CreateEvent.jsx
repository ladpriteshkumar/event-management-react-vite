import React, { useState, useEffect } from "react";
import "./CreateEvent.css";
import GooglePlaceAutocomplete from "../googlePlaceApi/PlaceAutocompleteElement";
import { usePreventEnterSubmit } from "../../customHooks/UsePreventEnterSubmit.js";
import EventService from "../../services/EventServices.js";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CreateEvent = () => {
    const [form, setForm] = useState({
        name: "",
        date: "",
        location: "",
        description: "",
    });
     
    const { id } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const preventEnterSubmit = usePreventEnterSubmit();
    const navigate = useNavigate();

    useEffect(() => {
        GetEvent();
    }, [id]);

    const GetEvent = () => {
        if (id) {
            setIsEditMode(true);
            setFetchLoading(true);
            EventService.getEvent(id)
                .then((event) => {
                    setForm({
                        name: event.name || "",
                        date: event.date || "",
                        location: event.location || "",
                        description: event.description || "",
                    });
                })
                .catch((error) => {
                    alert("Failed to fetch event: " + (error.message || error));
                    navigate("/"); // Redirect back if event not found
                })
                .finally(() => {
                    setFetchLoading(false);
                });
        } else {
            setIsEditMode(false);
            setForm({
                name: "",
                date: "",
                location: "",
                description: "",
            });
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (isEditMode) {
                // Update existing event
                await EventService.updateEvent(id, form);
                alert("Event updated successfully!");
            } else {
                // Create new event
                await EventService.addEvent(form);
                alert("Event created successfully!");
                setForm({ name: "", date: "", location: "", description: "" });
            }
            
            navigate("/select-contact"); // Redirect after successful operation
        } catch (error) {
            const action = isEditMode ? "update" : "create";
            alert(`Failed to ${action} event: ` + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditMode || !id) return;
        
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event? This action cannot be undone."
        );
        
        if (!confirmDelete) return;
        
        setDeleteLoading(true);
        try {
            await EventService.deleteEvent(id);
            alert("Event deleted successfully!");
            navigate("/"); // Redirect to home/events list
        } catch (error) {
            alert("Failed to delete event: " + (error.message || error));
        } finally {
            setDeleteLoading(false);
        }
    };

    const handlePlaceSelected = (place) => {
        if (place && place.formatted_address) {
            setForm(f => ({ ...f, location: place.formatted_address }));
        }
    };

    // Show loading while fetching event data in edit mode
    if (isEditMode && fetchLoading) {
        return (
            <div className="create-event-container">
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px',
                    fontSize: '18px'
                }}>
                    <div>📥 Loading event details...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="create-event-container">
            {/* Dynamic Header with Delete Button */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h2>{isEditMode ? "✏️ Edit Event" : "➕ Create Event"}</h2>
                {isEditMode && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        style={{
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "8px 16px",
                            cursor: deleteLoading ? "not-allowed" : "pointer",
                            opacity: deleteLoading ? 0.6 : 1,
                            fontSize: "14px"
                        }}
                    >
                        {deleteLoading ? "🗑️ Deleting..." : "🗑️ Delete Event"}
                    </button>
                )}
            </div>

            {/* Event Form */}
            <form onSubmit={handleSubmit} onKeyDown={preventEnterSubmit}>
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
                            placeholder="Enter event name"
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
                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Location:
                        <GooglePlaceAutocomplete
                            onPlaceSelected={handlePlaceSelected}
                            value={form.location}
                            placeholder="Search for a location"
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
                            placeholder="Enter event description (optional)"
                        />
                    </label>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '20px' 
                }}>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            background: loading ? "#6c757d" : (isEditMode ? "#28a745" : "#007bff"),
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "10px 20px",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                            fontSize: "16px"
                        }}
                    >
                        {loading 
                            ? (isEditMode ? "⏳ Updating..." : "⏳ Creating...") 
                            : (isEditMode ? "✅ Update Event" : "➕ Create Event")
                        }
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{ 
                            background: "#6c757d", 
                            color: "#fff", 
                            border: "none", 
                            borderRadius: "4px", 
                            padding: "10px 20px", 
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >
                        ❌ Cancel
                    </button>
                    
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={() => navigate("/send-invite")}
                            style={{ 
                                background: "#17a2b8", 
                                color: "#fff", 
                                border: "none", 
                                borderRadius: "4px", 
                                padding: "10px 20px", 
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            📧 Send Invites
                        </button>
                    )}
                </div>
            </form>

            {/* Mode Indicator */}
            <div style={{
                marginTop: '20px',
                padding: '10px',
                backgroundColor: isEditMode ? '#d1ecf1' : '#d4edda',
                border: `1px solid ${isEditMode ? '#bee5eb' : '#c3e6cb'}`,
                borderRadius: '4px',
                color: isEditMode ? '#0c5460' : '#155724',
                fontSize: '14px'
            }}>
                <strong>
                    {isEditMode 
                        ? `✏️ Editing: ${form.name || 'Untitled Event'}` 
                        : "➕ Creating new event"
                    }
                </strong>
                {isEditMode && (
                    <div style={{ marginTop: '5px', fontSize: '12px' }}>
                        Event ID: {id}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateEvent;
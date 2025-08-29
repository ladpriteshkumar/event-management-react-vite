import React from "react";
import GetContacts from "../googlePeopleApi/GetContacts.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SelectContact = () => {
    const [message, setMessage] = useState("");
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();
    const { eventId } = useParams();

    // Clear localStorage and initialize empty contacts on component mount
    useEffect(() => {
        localStorage.removeItem('selectedContacts');
        setContacts([]);
    }, []);

    // Save contacts to localStorage whenever contacts change
    useEffect(() => {
        if (contacts.length > 0) {
            localStorage.setItem('selectedContacts', JSON.stringify(contacts));
        }
    }, [contacts]);

    const handleNextClick = () => {
        console.log("Next button clicked"); // Debug log
        console.log("Contacts selected:", contacts); // Debug log
        console.log("EventId:", eventId); // Debug log

        if (contacts.length === 0) {
            alert('Please select at least one contact');
            return;
        }

        // Save selected contacts to localStorage
        localStorage.setItem('selectedContacts', JSON.stringify(contacts));
        
        try {
            // Navigate to Send Invite page
            if (eventId) {
                console.log(`Navigating to: /events/${eventId}/send-invite`); // Debug log
                navigate(`/events/${eventId}/send-invite`, {
                    state: { selectedContacts: contacts },
                    replace: false
                });
            } else {
                console.log("Navigating to: /send-invite"); // Debug log
                navigate('/send-invite', {
                    state: { selectedContacts: contacts },
                    replace: false
                });
            }
        } catch (error) {
            console.error("Navigation error:", error);
            alert("Navigation failed: " + error.message);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    // Get phone number only digits
    const getPhoneNumberDigits = (phone) => {
        return phone.replace(/\D/g, "");
    };

    return (
        <div className="container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "30px"
            }}>
                <div>
                    <h2 style={{ margin: "0 0 10px 0", color: "#343a40" }}>
                        👥 Select Contacts for Invitation
                    </h2>
                    {eventId && (
                        <p style={{ margin: 0, color: "#6c757d" }}>
                            Event ID: {eventId} - Selecting contacts for event invitations
                        </p>
                    )}
                </div>
                <button 
                    onClick={handleBackClick}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    ← Back
                </button>
            </div>

            {/* Contact Selection Component */}
            <div style={{ 
                backgroundColor: "white",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px"
            }}>
                <GetContacts onContactSelected={setContacts} />
            </div>

            {/* Debug Information */}
            <div style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                marginBottom: "20px",
                fontSize: "12px",
                color: "#6c757d"
            }}>
                <strong>Debug Info:</strong><br/>
                EventId: {eventId || "None"}<br/>
                Selected Contacts: {contacts.length}<br/>
                Navigation Target: {eventId ? `/events/${eventId}/send-invite` : '/send-invite'}
            </div>

            {/* Selected Contacts Summary */}
            <div style={{ 
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "20px"
            }}>
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px"
                }}>
                    <div>
                        {contacts.length > 0 ? (
                            <>
                                <h3 style={{ margin: "0 0 5px 0", color: "#28a745" }}>
                                    ✅ {contacts.length} Contact{contacts.length !== 1 ? 's' : ''} Selected
                                </h3>
                                <p style={{ margin: 0, color: "#6c757d", fontSize: "14px" }}>
                                    Ready to send invitations to selected contacts
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 style={{ margin: "0 0 5px 0", color: "#dc3545" }}>
                                    ❌ No Contacts Selected
                                </h3>
                                <p style={{ margin: 0, color: "#6c757d", fontSize: "14px" }}>
                                    Please select contacts to continue
                                </p>
                            </>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        {/* Test Navigation Button */}
                        <button 
                            onClick={() => {
                                console.log("Test navigation clicked");
                                window.location.href = eventId ? `#/events/${eventId}/send-invite` : '#/send-invite';
                            }}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#ffc107",
                                color: "black",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px"
                            }}
                        >
                            🧪 Test Navigate
                        </button>

                        {/* Clear Selection Button */}
                        {contacts.length > 0 && (
                            <button 
                                onClick={() => {
                                    setContacts([]);
                                    localStorage.removeItem('selectedContacts');
                                }}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                            >
                                🗑️ Clear Selection
                            </button>
                        )}

                        {/* Next Button */}
                        <button 
                            onClick={handleNextClick}
                            disabled={contacts.length === 0}
                            style={{ 
                                padding: "12px 24px",
                                backgroundColor: contacts.length === 0 ? "#6c757d" : "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: contacts.length === 0 ? "not-allowed" : "pointer",
                                fontSize: "16px",
                                fontWeight: "600",
                                opacity: contacts.length === 0 ? 0.6 : 1
                            }}
                        >
                            📧 PROCEED TO SEND INVITES ({contacts.length})
                        </button>
                    </div>
                </div>

                {/* Selected Contacts Preview */}
                {contacts.length > 0 && (
                    <div style={{ 
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #dee2e6"
                    }}>
                        <h4 style={{ margin: "0 0 15px 0", color: "#343a40" }}>
                            📋 Selected Contacts Preview:
                        </h4>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "10px",
                            maxHeight: "200px",
                            overflowY: "auto"
                        }}>
                            {contacts.slice(0, 10).map((contact, index) => (
                                <div 
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "8px 12px",
                                        backgroundColor: "white",
                                        border: "1px solid #e9ecef",
                                        borderRadius: "4px",
                                        fontSize: "14px"
                                    }}
                                >
                                    <span>👤</span>
                                    <div>
                                        <div style={{ fontWeight: "600", color: "#343a40" }}>
                                            {contact.name}
                                        </div>
                                        <div style={{ color: "#6c757d", fontSize: "12px" }}>
                                            📱 {contact.phone}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {contacts.length > 10 && (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px 12px",
                                    backgroundColor: "#e9ecef",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    color: "#6c757d"
                                }}>
                                    +{contacts.length - 10} more contacts...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectContact;
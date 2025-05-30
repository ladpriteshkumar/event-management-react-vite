import React, { useState } from "react";

function SendInvite({ contacts = [], onSend }) {
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleCheckboxChange = (email) => {
        setSelectedContacts((prev) =>
            prev.includes(email)
                ? prev.filter((e) => e !== email)
                : [...prev, email]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedContacts.length === 0) {
            alert("Please select at least one contact.");
            return;
        }
        setSending(true);
        try {
            // Call parent handler or API to send invites
            if (onSend) {
                await onSend(selectedContacts, message);
            } else {
                // Simulate sending
                await new Promise((res) => setTimeout(res, 1000));
                alert("Invitations sent!");
            }
            setSelectedContacts([]);
            setMessage("");
        } catch (err) {
            alert("Failed to send invites.");
        }
        setSending(false);
    };

    return (
        <div>
            <h2>Send Invitation</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ccc", padding: 8, marginBottom: 12 }}>
                    {contacts.length === 0 && <div>No contacts available.</div>}
                    {contacts.map((contact, idx) => (
                        <div key={idx}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={contact.emailAddresses?.[0]?.value || ""}
                                    checked={selectedContacts.includes(contact.emailAddresses?.[0]?.value)}
                                    onChange={() => handleCheckboxChange(contact.emailAddresses?.[0]?.value)}
                                    disabled={!contact.emailAddresses || contact.emailAddresses.length === 0}
                                />
                                {contact.names?.[0]?.displayName || "No Name"}
                                {contact.emailAddresses && contact.emailAddresses.length > 0
                                    ? ` (${contact.emailAddresses[0].value})`
                                    : " (No Email)"}
                            </label>
                        </div>
                    ))}
                </div>
                <div>
                    <textarea
                        placeholder="Invitation message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={3}
                        style={{ width: "100%", marginBottom: 12 }}
                    />
                </div>
                <button type="submit" disabled={sending}>
                    {sending ? "Sending..." : "Send Invite"}
                </button>
            </form>
        </div>
    );
}

export default SendInvite;
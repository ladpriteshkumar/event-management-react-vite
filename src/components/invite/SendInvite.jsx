import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import EventService from '../../services/EventServices';
import MessageToSendServices from '../../services/MessageToSendServices';
import './SendInvite.css';

const SendInvite = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State management
    const [event, setEvent] = useState(null);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [sendResults, setSendResults] = useState(null);

    // Default message template
    const defaultMessage = `Hi {name}! 👋

You're invited to {eventName}! 

📅 Date: {date}
📍 Location: {location}
📝 Description: {description}

Hope to see you there! 🎉`;

    useEffect(() => {
        loadData();
        
        // Load selected contacts from previous page or localStorage
        if (location.state?.selectedContacts) {
            setSelectedContacts(location.state.selectedContacts);
        } else {
            const savedContacts = localStorage.getItem('selectedContacts');
            if (savedContacts) {
                setSelectedContacts(JSON.parse(savedContacts));
            }
        }
    }, [eventId, location.state]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load event details
            if (eventId) {
                const eventData = await EventService.getEvent(eventId);
                setEvent(eventData);
                
                // Set default message with event details
                setMessage(generateMessage(defaultMessage, eventData));
            } else {
                setMessage(defaultMessage);
            }
            
        } catch (error) {
            alert('Failed to load data: ' + error.message);
            if (eventId) {
                navigate('/events');
            }
        } finally {
            setLoading(false);
        }
    };

    const generateMessage = (template, eventData) => {
        if (!eventData) return template;
        
        return template
            .replace(/{eventName}/g, eventData.name || 'Event')
            .replace(/{date}/g, formatDate(eventData.date) || 'TBD')
            .replace(/{location}/g, eventData.location || 'TBD')
            .replace(/{description}/g, eventData.description || 'No description available');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Simple WhatsApp URL generation (no external service)
    const generateWhatsAppURL = (phoneNumber, message) => {
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    };

    const personalizeMessage = (message, contact) => {
        return message.replace(/{name}/g, contact.name || 'there');
    };

    const sendInvites = async () => {
        if (selectedContacts.length === 0) {
            alert('No contacts selected. Please go back and select contacts.');
            return;
        }

        if (!message.trim()) {
            alert('Please enter a message');
            return;
        }

        setSending(true);
        setSendResults(null);

      
            // Save message to database before sending
            const messageData = {
                eventId: eventId,
                message: message,
                recipientCount: selectedContacts.length,
                contacts: selectedContacts.map(contact => ({
                    name: contact.name,
                    phone: contact.phone
                }))
            };

            await MessageToSendServices.addMessage(messageData).then(() => {
                alert('Message saved successfully');
            }).catch(error => {
                alert('Failed to save message: ' + error.message);
                return;
            });

    };

    if (loading) {
        return (
            <div className="send-invite-container">
                <div className="loading-state">
                    <div>📥 Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="send-invite-container">
            {/* Header */}
            <div className="header">
                <div>
                    <h2>📧 Send Event Invitations</h2>
                    {event && (
                        <div className="event-info">
                            <h3>📅 {event.name}</h3>
                            <p>{formatDate(event.date)} • {event.location}</p>
                        </div>
                    )}
                </div>
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            <div className="send-invite-content">
                {/* Left Panel - Selected Contacts Display */}
                <div className="contacts-panel">
                    <div className="panel-header">
                        <h3>👥 Selected Contacts ({selectedContacts.length})</h3>
                        <button 
                            className="select-all-btn"
                            onClick={() => navigate(-1)}
                        >
                            Change Selection
                        </button>
                    </div>

                    <div className="contacts-list">
                        {selectedContacts.map((contact, index) => (
                            <div 
                                key={contact.id || index}
                                className="contact-item selected"
                            >
                                <div className="contact-info">
                                    <div className="contact-name">{contact.name}</div>
                                    <div className="contact-details">
                                        📱 {contact.phone}
                                    </div>
                                </div>
                                <div className="contact-checkbox">
                                    ✅
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedContacts.length === 0 && (
                        <div className="empty-state">
                            <p>No contacts selected</p>
                            <button onClick={() => navigate('/select-contacts')}>
                                Select Contacts
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Panel - Message Box */}
                <div className="message-panel">
                    {/* Message Editor */}
                    <div className="message-section">
                        <h3>✏️ Message</h3>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your invitation message..."
                            rows={15}
                            className="message-textarea"
                        />
                        <div className="message-info">
                            <small>💡 Use {'{name}'} to personalize messages with contact names</small>
                        </div>
                    </div>

                    {/* Send Button */}
                    <div className="send-section">
                        <button
                            onClick={sendInvites}
                            disabled={sending || selectedContacts.length === 0 || !message.trim()}
                            className="send-button"
                        >
                            {sending ? (
                                '📤 Opening WhatsApp Chats...'
                            ) : (
                                `📧 Send to ${selectedContacts.length} Contact${selectedContacts.length !== 1 ? 's' : ''}`
                            )}
                        </button>
                        
                        <div className="send-info">
                            <small>
                                📱 This will open WhatsApp chats for each selected contact. 
                                You'll need to manually click "Send" in each chat.
                            </small>
                        </div>
                    </div>

                    {/* Send Results */}
                    {sendResults && (
                        <div className="results-section">
                            <h3>📊 Send Results</h3>
                            <div className="results-list">
                                {sendResults.map((result, index) => (
                                    <div 
                                        key={index}
                                        className={`result-item ${result.success ? 'success' : 'error'}`}
                                    >
                                        <div className="result-contact">
                                            {result.success ? '✅' : '❌'} {result.contact}
                                        </div>
                                        <div className="result-details">
                                            WhatsApp • {result.phone}
                                            {result.error && <div className="error-text">{result.error}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SendInvite;
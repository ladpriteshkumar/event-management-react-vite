import React, { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/header/Header.jsx';
import CreateEvent from './components/event/CreateEvent.jsx';
import EventList from './components/event/EventList.jsx';
import EventService from "./services/EventServices.js";
import GetContacts from './components/googlePeopleApi/GetContacts.jsx';
import SendInvite from './components/invite/SendInvite.jsx';

function App() {
  const [showCreate, setShowCreate] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showEvents, setShowEvents] = useState(true); // default is shown (true)
  const [showInvite, setShowInvite] = useState(false); // default is hidden (false)
  const eventListRef = useRef();

  // Handler to receive contacts from GetContacts
  const handleContactsFetched = (contactsList) => {
    setContacts(contactsList);
  };

  // Create event handler
  const handleCreateEvent = async (eventData) => {
    try {
      await EventService.addEvent(eventData);
      // if (eventListRef.current && eventListRef.current.refreshEvents) {
      //   eventListRef.current.refreshEvents();
      // }
      setShowCreate(false);
      setEditEvent(null);
      setShowInvite(true); // Show SendInvite after event creation
      setShowEvents(false); // Hide EventList after event creation
    } catch (error) {
      alert("Failed to create event");
    }
  };

  // Update event handler
  const handleUpdateEvent = async (id, updatedData) => {
    try {
      await EventService.updateEvent(id, updatedData);
      if (eventListRef.current && eventListRef.current.refreshEvents) {
        eventListRef.current.refreshEvents();
      }
      setShowCreate(false);
      setEditEvent(null);
    } catch (error) {
      alert("Failed to update event");
    }
  };

  // Edit event trigger
  const handleEditEvent = (event) => {
    setEditEvent(event);
    setShowCreate(true);
  };

  const handleOnToggle = () => {
    setShowCreate(prev => !prev);
    setShowEvents(prev => !prev);
    setEditEvent(null);
  };

  // Example onSend handler for SendInvite
  const handleSendInvite = async (selectedEmails, message) => {
    // Implement your invite sending logic here
    alert(`Invites sent to: ${selectedEmails.join(", ")}\nMessage: ${message}`);
    setShowInvite(false);
  };

  return (
    <>
      <Header />
      <BrowserRouter>
      <Routes>
        <Route path="/event-management-react-vite/" element={<EventList show={showEvents} ref={eventListRef} onEdit={handleEditEvent} />} />
        <Route path="/event-management-react-vite/create-event" element={<CreateEvent />} />
        <Route path="/event-management-react-vite/send-invite" element={<SendInvite />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;

import { useState, useRef } from 'react'
import './App.css'
import Header from './components/header/Header.jsx'
import CreateEvent from './components/event/CreateEvent.jsx'
import EventList from './components/event/EventList.jsx';
import EventService from "./services/EventServices.js";

function App() {
  const [showCreate, setShowCreate] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const eventListRef = useRef();

  // Create event handler
  const handleCreateEvent = async (eventData) => {
    try {
      await EventService.addEvent(eventData);
      if (eventListRef.current && eventListRef.current.refreshEvents) {
        eventListRef.current.refreshEvents();
      }
      setShowCreate(false);
      setEditEvent(null);
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
    setEditEvent(null);
  };

  return (
    <>
      <Header />
      <div>
        <h1>Event Management</h1>
        <div className="container">
          <CreateEvent
            show={showCreate}
            onToggle={handleOnToggle}
            onCreate={handleCreateEvent}
            editEvent={editEvent}
            onUpdate={handleUpdateEvent}
          />
          <EventList ref={eventListRef} onEdit={handleEditEvent} />
        </div>
      </div>
    </>
  )
}

export default App

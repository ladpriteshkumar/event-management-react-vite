import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header/Header.jsx'
import CreateEvent from './components/event/CreateEvent.jsx'
import EventList from './components/event/EventList.jsx';

function App() {
  const [events, setEvents] = useState([]);

  // Handler to add a new event
  const handleCreateEvent = (event) => {
    setEvents([...events, event]);
  };

  // Handler for toggling (example: show/hide create event form)
  const [showCreate, setShowCreate] = useState(false);

  const handleOnToggle = () => {
    setShowCreate(prev => !prev);
  };

  return (
    <>
      <Header />
      <div>
        <h1>Event Management</h1>   
        <div className="container">
          <CreateEvent show={showCreate} onToggle={handleOnToggle} onCreate={handleCreateEvent} />
          <EventList events={events} />
        </div>
      </div>
    </>
  )
}

export default App

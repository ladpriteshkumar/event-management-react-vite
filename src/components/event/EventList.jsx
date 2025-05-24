import React from "react";
import "./EventList.css";
const EventList = ({ events }) => (
    <>
    <h2>Event List</h2>
    <table className="event-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {events.length === 0 ? (
                <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                        No events found.
                    </td>
                </tr>
            ) : (
                events.map((event, idx) => (
                    <tr key={idx}>
                        <td>{event.name}</td>
                        <td>{event.date}</td>
                        <td>{event.location}</td>
                        <td>{event.description}</td>
                    </tr>
                ))
            )}
        </tbody>
    </table>
    </>
);

export default EventList;
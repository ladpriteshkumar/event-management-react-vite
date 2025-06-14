import React from "react";
import GetContacts from "../googlePeopleApi/GetContacts.jsx"; // Adjust the import path as needed
import whatsAppService from "../../services/whatsAppService.js";
import { useState, useEffect } from "react";

const SelectContact = () => {
    const [message, setMessage] = useState("");
    const [contacts, setContacts] = useState([]);

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
        // Save selected contacts to localStorage
        localStorage.setItem('selectedContacts', JSON.stringify(contacts));
        console.log("Selected contacts saved to localStorage:", contacts);
        
        // You can add navigation logic here if needed
        // For example: navigate to next page or show success message
        alert(`${contacts.length} contacts saved successfully!`);
    };

    //get phone number only digits
    const getPhoneNumberDigits = (phone) => {
        return phone.replace(/\D/g, "");
    };

    return (
        <div className="container">
            {/* <h2>Select Contacts</h2> */}
            <GetContacts onContactSelected={setContacts} />
            <div style={{ marginTop: "20px" }}>
                {contacts.length > 0 && (
                    <p>Selected contacts: {contacts.length}</p>
                )}
                <button 
                    style={{ 
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }} 
                    onClick={handleNextClick}
                    disabled={contacts.length === 0}
                >
                    NEXT ({contacts.length} selected)
                </button>
            </div>
        </div>
    );
}

export default SelectContact;
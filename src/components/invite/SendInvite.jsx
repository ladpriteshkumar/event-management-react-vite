import React from "react";
import GetContacts from "../googlePeopleApi/GetContacts.jsx"; // Adjust the import path as needed
import whatsAppService from "../../services/whatsAppService.js";
import { useState,useEffect } from "react";

const SendInvite = () => {
    const [message, setMessage] = useState("");
    const [contacts, setContacts] = useState([]);


    const sendInviteTOWhatsApp = () => {

        contacts.forEach(contact => {
            //wait 10 seconds before sending the message
            setTimeout(() => {
                console.log("Sending message to:", contact);
            }, 10000);

            Promise.resolve( whatsAppService.SendMessageToWhatsApp(getPhoneNumberDigits('+12018877834'), message)).then(response => {
                if (response.ok) {
                    console.log("Message sent successfully to:", contact);
                }
                else {
                    console.error("Failed to send message to:", contact);
                }
            });
        });
    }
    


    //get phone number only digits
    const getPhoneNumberDigits = (phone) => {
        return phone.replace(/\D/g, "");
    };

    return (
        <div className="container">
            <h2>Send Invitation</h2>
            <GetContacts onContactSelected={setContacts} />

            <textarea  placeholder="Enter your message here" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <button style={{ marginTop: "110px" }} onClick={sendInviteTOWhatsApp}>Send WhatsApp Invite</button>
        </div>
    );
}

export default SendInvite;
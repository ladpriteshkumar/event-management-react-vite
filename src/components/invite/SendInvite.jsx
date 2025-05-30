import React from "react";
import GetContacts from "../googlePeopleApi/GetContacts.jsx"; // Adjust the import path as needed

function SendInvite() {
    const handleContactsFetched = (contactsList) => {
        // You can handle fetched contacts here if needed
    };

    return (
        <div className="container">
            <h2>Send Invitation</h2>
            <GetContacts onContactsFetched={handleContactsFetched} />
        </div>
    );
}

export default SendInvite;
import React, { useState } from "react";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const SCOPES = "https://www.googleapis.com/auth/contacts.readonly";
const PAGE_SIZE = 10; // Number of contacts per page

const GetContacts = ({ onContactSelected }) => {
    const [contacts, setContacts] = useState([]);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Request all available fields for each contact
    const customPersonFields =  [
                    "names",
                    "emailAddresses",
                    "phoneNumbers",
                    "photos",
                    "addresses",
                    "birthdays",
                    "biographies",
                    "genders",
                    "organizations",
                    "occupations",
                    "events",
                    "urls",
                    "userDefined",
                    "imClients",
                    "relations",
                    "sipAddresses",
                    "residences",
                    "coverPhotos",
                    "ageRanges",
                    "clientData",
                    "metadata"
                ].join(",")

    const login = useGoogleLogin({
        scope: SCOPES,
        onSuccess: tokenResponse => {
            setToken(tokenResponse.access_token);
            // Automatically fetch contacts after successful login
            fetchAllContactsWithToken(tokenResponse.access_token);
        },
        onError: error => alert("Login Failed: " + error.error),
        flow: "implicit",
    });

    // Modified function to accept token parameter for immediate use after login
    const fetchAllContactsWithToken = async (accessToken) => {
        const tokenToUse = accessToken || token;
        if (!tokenToUse) return;
        
        setLoading(true);
        let allContacts = [];
        let nextPageToken = undefined;
        try {
            do {
                const params = new URLSearchParams({
                    personFields: customPersonFields
                });
                if (nextPageToken) params.append("pageToken", nextPageToken);
                const res = await fetch(
                    `https://people.googleapis.com/v1/people/me/connections?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenToUse}`,
                        },
                    }
                );
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                allContacts = allContacts.concat(data.connections || []);
                nextPageToken = data.nextPageToken;
            } while (nextPageToken);

            for (const person of allContacts) {
                person.IsChecked = false; // Reset selection state
            }

            setContacts(allContacts);
            setPage(1); // Reset to first page after loading
        } catch (err) {
            alert("Failed to fetch contacts: " + err.message);
        }
        setLoading(false);
    };

    // Keep the original function for existing calls
    const fetchAllContacts = () => fetchAllContactsWithToken(token);

    useEffect(() => {
        onContactSelected(selectedContacts);
    }, [selectedContacts]);

    const formatPhoneNumber = (phone)=> {
        const regex = /^\+?([1-9]\d{1,2})\s?(\d{10})$/;
        const match = phone.replace(/\D/g, "").match(/^(\d{1,3})(\d{10})$/); 

        if (!match) return "Invalid phone number " + `(${phone})`;

        return   `+${match[1]}  ${match[2].slice(0,3)}-${match[2].slice(3,6)}-${match[2].slice(6)}`;
    } 

        




    // Filter contacts based on search term only
    const filteredContacts = contacts.filter(person => {
        const name = person.names && person.names.length > 0 ? person.names[0].displayName.toLowerCase() : "";
        const email = person.emailAddresses && person.emailAddresses.length > 0 ? person.emailAddresses[0].value.toLowerCase() : "";
        const phone = person.phoneNumbers && person.phoneNumbers.length > 0 ? person.phoneNumbers[0].value : "";
        
        return name.includes(searchTerm.toLowerCase()) || 
               email.includes(searchTerm.toLowerCase()) || 
               phone.includes(searchTerm);
    });

    // Paging logic after filtering
    const totalPages = Math.ceil(filteredContacts.length / PAGE_SIZE);
    const pagedContacts = filteredContacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    //get selected contacts out to GetContacts component
    const selectContactToSendMessage = (checked, person) => {
        if (checked) {
            person.IsChecked = true;
            // Add contact to selected list
            setSelectedContacts(prevSelected => [
                ...prevSelected,
                {
                    name: person.names && person.names.length > 0 ? person.names[0].displayName : "",
                    phone: person.phoneNumbers && person.phoneNumbers.length > 0 ? formatPhoneNumber(person.phoneNumbers[0].value) : "",
                    email: person.emailAddresses && person.emailAddresses.length > 0 ? person.emailAddresses[0].value : ""
                }
            ]);
        } else {
            person.IsChecked = false;
            // Remove contact from selected list
            setSelectedContacts(prevSelected => {
                return prevSelected.filter(contact => contact.phone !== (person.phoneNumbers && person.phoneNumbers.length > 0 ? formatPhoneNumber(person.phoneNumbers[0].value) : ""));
            });
        }
    }



    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ marginBottom: "20px", color: "#333" }}>Google Contacts</h2>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button 
                    onClick={() => {
                        if (!token) {
                            login(); // This will automatically fetch contacts after login
                        } else {
                            fetchAllContacts(); // This will fetch contacts if already logged in
                        }
                    }} 
                    disabled={loading}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: loading ? "#6c757d" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Loading..." : "Get Contacts From Google Account"}
                </button>
                {token && (
                    <button 
                        onClick={() => setToken(null)}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Sign out
                    </button>
                )}
            </div>

            {contacts.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Search contacts by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>
            )}

            {filteredContacts.length > 0 && (
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "20px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "5px"
                }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: page === 1 ? "#e9ecef" : "#007bff",
                            color: page === 1 ? "#6c757d" : "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: page === 1 ? "not-allowed" : "pointer"
                        }}
                    >
                        ← Previous
                    </button>
                    <span style={{ 
                        fontWeight: "bold", 
                        color: "#495057",
                        fontSize: "14px"
                    }}>
                        Page {page} of {totalPages} ({filteredContacts.length} contacts)
                        {searchTerm && ` (filtered from ${contacts.length} total)`}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: page === totalPages ? "#e9ecef" : "#007bff",
                            color: page === totalPages ? "#6c757d" : "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: page === totalPages ? "not-allowed" : "pointer"
                        }}
                    >
                        Next →
                    </button>
                </div>
            )}
            
            {filteredContacts.length > 0 && (
                <div style={{ 
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    <table style={{ 
                        width: "100%", 
                        borderCollapse: "collapse",
                        backgroundColor: "white"
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f8f9fa" }}>
                                <th style={{ 
                                    border: "1px solid #dee2e6", 
                                    padding: "12px 8px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    color: "#495057",
                                    width: "60px"
                                }}>
                                    Select
                                </th>
                                <th style={{ 
                                    border: "1px solid #dee2e6", 
                                    padding: "12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    color: "#495057"
                                }}>
                                    Name
                                </th>
                                <th style={{ 
                                    border: "1px solid #dee2e6", 
                                    padding: "12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    color: "#495057"
                                }}>
                                    Email
                                </th>
                                <th style={{ 
                                    border: "1px solid #dee2e6", 
                                    padding: "12px",
                                    textAlign: "left",
                                    fontWeight: "600",
                                    color: "#495057"
                                }}>
                                    Phone
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedContacts.map((person, idx) => (
                                <tr key={idx} style={{ 
                                    backgroundColor: idx % 2 === 0 ? "white" : "#f8f9fa",
                                    '&:hover': { backgroundColor: "#e9ecef" }
                                }}>
                                    <td style={{ 
                                        border: "1px solid #dee2e6", 
                                        padding: "12px 8px",
                                        textAlign: "center"
                                    }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedContacts.some(contact => 
                                                contact.phone === (person.phoneNumbers && person.phoneNumbers.length > 0 
                                                    ? formatPhoneNumber(person.phoneNumbers[0].value) 
                                                    : "")
                                            )} 
                                            onChange={(e) => selectContactToSendMessage(e.target.checked, person)}
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                cursor: "pointer"
                                            }}
                                        />
                                    </td>
                                    <td style={{ 
                                        border: "1px solid #dee2e6", 
                                        padding: "12px",
                                        color: "#212529"
                                    }}>
                                        {person.names && person.names.length > 0 ? person.names[0].displayName : "—"}
                                    </td>
                                    <td style={{ 
                                        border: "1px solid #dee2e6", 
                                        padding: "12px",
                                        color: "#212529"
                                    }}>
                                        {person.emailAddresses && person.emailAddresses.length > 0
                                            ? person.emailAddresses[0].value
                                            : "—"}
                                    </td>
                                    <td style={{ 
                                        border: "1px solid #dee2e6", 
                                        padding: "12px",
                                        color: "#212529"
                                    }}>
                                        {person.phoneNumbers && person.phoneNumbers.length > 0
                                            ? formatPhoneNumber(person.phoneNumbers[0].value)
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {contacts.length > 0 && filteredContacts.length === 0 && (
                <div style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#6c757d",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px"
                }}>
                    No contacts found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
}

export default GetContacts;
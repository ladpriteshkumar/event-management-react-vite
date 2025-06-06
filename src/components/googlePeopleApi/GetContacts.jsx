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
        onSuccess: tokenResponse => setToken(tokenResponse.access_token),
        onError: error => alert("Login Failed: " + error.error),
        flow: "implicit",
    });

    useEffect(() => {
        onContactSelected(selectedContacts);
    }, [selectedContacts]);

    const formatPhoneNumber = (phone)=> {
        const regex = /^\+?([1-9]\d{1,2})\s?(\d{10})$/;
        const match = phone.replace(/\D/g, "").match(/^(\d{1,3})(\d{10})$/); 

        if (!match) return "Invalid phone number " + `(${phone})`;

        return   `+${match[1]}  ${match[2].slice(0,3)}-${match[2].slice(3,6)}-${match[2].slice(6)}`;
    } 

        




    // Fetch all contacts (no pageSize param, uses API default)
    const fetchAllContacts = async () => {
        if (!token) return;
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
                            Authorization: `Bearer ${token}`,
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

    // Paging logic after all contacts are fetched
    const totalPages = Math.ceil(contacts.length / PAGE_SIZE);
    const pagedContacts = contacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    
    //get selected contacts out to GetContacts component
    const selectContactToSendMessage = (checked, person) => {
        if (checked) {
            person.IsChecked = true;
            // Add contact to selected list
            setSelectedContacts(prevSelected => [
                ...prevSelected,
                {
                    phone: person.phoneNumbers && person.phoneNumbers.length > 0 ? formatPhoneNumber(person.phoneNumbers[0].value) : ""
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
        <div>
            <h2>Google Contacts</h2>
            {!token ? (
                <button onClick={() => login()}>Sign in with Google</button>
            ) : (
                <>
                    <button onClick={() => setToken(null)}>Sign out</button>
                    <button onClick={fetchAllContacts} disabled={loading}>
                        {loading ? "Loading..." : "Get All Contacts"}
                    </button>
                    {contacts.length > 0 && (
                        <div style={{ margin: "1rem 0" }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{ marginRight: 8 }}
                            >
                                Prev
                            </button>
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={{ marginLeft: 8 }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>select</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedContacts.map((person, idx) => (
                        <tr key={idx}>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {/* checkbox is not reseting status on page change */}
                                <input type="checkbox" checked= {selectedContacts.some(contact => contact.phone === (person.phoneNumbers && person.phoneNumbers.length > 0 ? formatPhoneNumber(person.phoneNumbers[0].value) : ""))} onChange={(e) => selectContactToSendMessage(e.target.checked,person)} />
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {person.names && person.names.length > 0 ? person.names[0].displayName : ""}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {person.emailAddresses && person.emailAddresses.length > 0
                                    ? person.emailAddresses[0].value
                                    : ""}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {person.phoneNumbers && person.phoneNumbers.length > 0
                                    ?  formatPhoneNumber(person.phoneNumbers[0].value)
                                    : ""}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GetContacts;
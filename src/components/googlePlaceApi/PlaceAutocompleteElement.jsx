import React, { useEffect, useRef } from "react";
///we are using the classic Google Maps JavaScript API for Places Autocomplete
//we can also make use google Pleac new
const GooglePlaceAutocomplete = ({ onPlaceSelected, value }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current && value !== undefined) {
            inputRef.current.value = value;
        }
    }, [value]);

    useEffect(() => {
        const apiKey = "AIzaSyBHTKNGepwzu1kClo0mN5PZpytDG66fES8";
        const scriptId = "google-maps-script";
        if (!window.google || !window.google.maps) {
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script");
                script.id = scriptId;
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = initializeAutocomplete;
                document.body.appendChild(script);
            } else {
                document.getElementById(scriptId).addEventListener("load", initializeAutocomplete);
            }
        } else {
            initializeAutocomplete();
        }

        function initializeAutocomplete() {
            if (window.google && window.google.maps && window.google.maps.places) {
                const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                    types: ["geocode"], // or ["establishment"]
                });
                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (onPlaceSelected) onPlaceSelected(place);
                });
            }
        }

        // Cleanup: nothing needed for classic API
    }, [onPlaceSelected]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Enter a location"
            style={{ width: "100%", padding: "8px" }}
            autoComplete="off"
        />
    );
};

export default GooglePlaceAutocomplete;
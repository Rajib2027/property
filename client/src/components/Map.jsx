import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GeoCoderMarker = ({ address }) => {
    const map = useMap();
    const [position, setPosition] = useState([0, 0]);

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await fetch(
                    `https://www.mapquestapi.com/geocoding/v1/address?key=DO1f01PBckEmq13aCY74zjuRZEQhaw7t&location=${encodeURIComponent(
                        address
                    )}`
                );

                if (!response.ok) {
                    throw new Error('Geocoding request failed');
                }

                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    const { lat, lng } = data.results[0].locations[0].latLng;
                    setPosition([lat, lng]);
                    map.flyTo([lat, lng], 6);
                } else {
                    console.log('No results found for the address:', address);
                }
            } catch (error) {
                console.error('Error during geocoding:', error);
            }
        };

        fetchGeoData();
    }, [address, map]);

    return (
        <Marker position={position}>
            <Popup>{address}</Popup>
        </Marker>
    );
};

export default function Map({ city, state ,pin}) {
    console.log('Location:', state, city,pin);

    return (
        <MapContainer
            center={[20.5937, 78.9629]}
            zoom={10}
            scrollWheelZoom={false}
            style={{
                height: '50vh',
                width: '100%',
                marginTop: '20px',
                zIndex: 0,
            }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoCoderMarker address={`${state} ${city} ${pin} `} />
        </MapContainer>
    );
}

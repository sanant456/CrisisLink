'use client';
import { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

// Default center: arbitrary location (could be the venue)
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

export default function LiveMap({ incidents = [], staff = [] }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [selectedIncident, setSelectedIncident] = useState(null);

  const center = useMemo(() => defaultCenter, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div style={{ height: '400px', background: '#1e1e1e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={center}
      options={{
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          // ... more dark theme styles could go here
        ],
        disableDefaultUI: true,
      }}
    >
      {/* Incident Markers */}
      {incidents.map((incident) => {
        // Mock coordinates based on center if missing
        const lat = incident.lat || center.lat + (Math.random() - 0.5) * 0.02;
        const lng = incident.lng || center.lng + (Math.random() - 0.5) * 0.02;

        return (
          <Marker
            key={incident.id}
            position={{ lat, lng }}
            onClick={() => setSelectedIncident(incident)}
            icon={{
              url: `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`,
              scaledSize: new window.google.maps.Size(24, 24),
            }}
          />
        );
      })}

      {selectedIncident && (
        <InfoWindow
          position={{
            lat: selectedIncident.lat || center.lat,
            lng: selectedIncident.lng || center.lng,
          }}
          onCloseClick={() => setSelectedIncident(null)}
        >
          <div style={{ color: 'black', padding: '8px', maxWidth: '200px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{selectedIncident.title}</h4>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px' }}>{selectedIncident.description}</p>
            <span style={{ 
              display: 'inline-block',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'red',
              color: 'white',
              fontSize: '10px'
            }}>
              {selectedIncident.severity}
            </span>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (from public folder)
const customIcon = new L.Icon({
  iconUrl: "/marker.png",
  iconRetinaUrl: "/marker.png",
  iconSize: [60, 60],
  // iconAnchor: [22, 44],
  // popupAnchor: [0, -32],
  shadowUrl: "", // Optional: if you have a shadow image
});

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");

  const map = useMapEvents({
    click: async (e) => {
      setPosition(e.latlng);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        const data = await response.json();
        setAddress(data.display_name);
        onLocationSelect(e.latlng, data.display_name);
      } catch (error) {
        console.error("Error getting address:", error);
        setAddress("Address not found");
        onLocationSelect(e.latlng, "Address not found");
      }
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>{address || "Loading address..."}</Popup>
    </Marker>
  );
}

export default function Map({ onLocationSelect }) {
  const [defaultPosition, setDefaultPosition] = useState([23.8103, 90.4125]); // Dhaka

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
}

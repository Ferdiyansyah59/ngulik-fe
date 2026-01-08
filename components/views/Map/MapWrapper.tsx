"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// --- Fix Icon Default Leaflet yang Error di Next.js ---
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// -----------------------------------------------------

// Helper Component: Biar peta otomatis geser kalau posisi user berubah
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export interface BriLocation {
  location_name: string; // json:"location_name"
  location_id: string; // json:"location_id"
  location_type: string; // json:"location_type"
  region: string; // json:"region"
  region_code: string; // json:"region_code"
  mainbranch: string; // json:"mainbranch"
  mainbranch_code: number; // json:"mainbranch_code"
  branch: string; // json:"branch"
  branch_code: number; // json:"branch_code"
  latitude_location: string; // json:"latitude_location" (PENTING BUAT MAP)
  longitude_location: string; // json:"longitude_location" (PENTING BUAT MAP)
  location_address: string; // json:"location_address"
  uker_type: string; // json:"uker_type"
  modified_date: string; // json:"modified_date"
  location_code: number; // json:"location_code"
  jarak: string; // json:"jarak"
  qms_availability: number; // json:"qms_availability"
}

interface MapProps {
  userPosition: [number, number]; // [lat, lng]
  locations: BriLocation[]; // Data ATM dari backend
}

export default function MapWrapper({ userPosition, locations }: MapProps) {
  return (
    // Style height wajib ada, kalau nggak peta gak muncul (height 0)
    <MapContainer
      center={userPosition}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Fitur Auto Center ke Lokasi User */}
      <RecenterMap lat={userPosition[0]} lng={userPosition[1]} />

      {/* Marker Posisi User (Kita bedain warnanya kalau bisa, atau pake icon beda) */}
      <Marker position={userPosition}>
        <Popup>
          <b>Posisi Kamu</b>
        </Popup>
      </Marker>

      {/* Loop Marker ATM/Cabang */}
      {locations.map((loc, idx) => {
        // Backend ngasih string, harus convert ke float
        const lat = parseFloat(loc.latitude_location);
        const lng = parseFloat(loc.longitude_location);

        // Skip kalau koordinat invalid
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker key={idx} position={[lat, lng]}>
            <Popup>
              <div className="text-sm">
                <b className="block mb-1">{loc.location_name}</b>
                <p className="mb-1">{loc.location_address}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {loc.jarak}
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

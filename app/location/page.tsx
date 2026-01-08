"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Wajib import ini
import { useAuthStore } from "@/store/useAuthStore";
import useGeoLocation from "@/hooks/useGeoLocation";
import api from "@/lib/axios";

// --- Load Peta secara Dynamic (Client Side Only) ---
const MapWithNoSSR = dynamic(
  () => import("@/components/views/Map/MapWrapper"),
  {
    ssr: false, // Matikan server-side rendering buat peta
    loading: () => (
      <div className="h-[500px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        Loading Map...
      </div>
    ),
  }
);
// ---------------------------------------------------

interface AtmLocation {
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

export default function DashboardPage() {
  const { isAuthenticate, logout, user } = useAuthStore();
  const location = useGeoLocation();
  const [atmList, setAtmList] = useState<AtmLocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAtm = async () => {
      if (!location.coordinates) return;

      setLoading(true);
      try {
        const res = await api.post("/bri-location/nearest-channel", {
          limit: 10, // Ambil agak banyakan biar peta rame
          latitude: location.coordinates.lat,
          longitude: location.coordinates.long,
          uker_type: 1,
          phone_number: "08123",
        });
        setAtmList(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (location.loaded && !location.error) {
      fetchAtm();
    }
  }, [location.loaded, location.coordinates]);

  if (!isAuthenticate) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Peta ATM Terdekat</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        {/* Render Peta Hanya Jika Koordinat User Sudah Dapet */}
        {location.coordinates ? (
          <MapWithNoSSR
            userPosition={[
              parseFloat(location.coordinates.lat),
              parseFloat(location.coordinates.long),
            ]}
            locations={atmList}
          />
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
            {location.error ? (
              <p className="text-red-500">
                Gagal memuat peta: {location.error.message}
              </p>
            ) : (
              <p className="text-gray-500 animate-pulse">
                Mencari titik GPS kamu...
              </p>
            )}
          </div>
        )}

        {/* List di Bawah Peta (Opsional, buat detail) */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            Detail Lokasi ({atmList.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-64 overflow-y-auto">
            {atmList.map((atm, idx) => (
              <div
                key={idx}
                className="border p-3 rounded hover:border-blue-500 cursor-pointer bg-gray-50"
              >
                <p className="font-bold text-sm text-gray-800">
                  {atm.location_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{atm.jarak}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

/* 
    Tentu, ini adalah contoh implementasi praktis menggunakan Next.js (App Router). Kita akan fokus pada tiga teknik optimasi utama.

Pastikan kamu sudah install library yang diperlukan untuk bagian Virtualization:

Bash

npm install react-window
1. Lazy Loading (Code Splitting)
Di Next.js, kita menggunakan next/dynamic. Ini berguna banget kalau kamu punya komponen 
berat (misalnya Peta/Map, Chart, atau Editor Teks) yang tidak perlu di-load saat halaman 
pertama dibuka.
  */
// ssr false -> berguna jika librarynya butuh akses window (client side)
/* 
  disini pake dynamic buat implementasi langsung lazy loadingnya. Jadi sebenernya
  kalo kita import biasa di atas danpa dynamic itu browser bakal download semua yang ada 
  disini termasuk komponen yang di import, tapi kalo pake dynamic, browser cuma bakal
  download si komponen yang di import itu setelah si komponen emng di trigger buat di load.
*/
const HeavyChart = dynamic(
  () => import("@/components/views/LazyLoading/HeavyChart"),
  {
    loading: () => <p className="p-4 text-gray-500,">Loading Chart....</p>,
    ssr: false,
  }
);

function LazyLoading() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard Analytics</h1>

      <button
        onClick={() => setShowChart(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Tampilkan Chart Berat
      </button>

      {/* Komponen (dan file JS-nya) baru akan di-download browser saat showChart = true */}
      <div className="mt-10 border border-gray-300 h-96 w-full flex items-center justify-center">
        {showChart && <HeavyChart />}
      </div>
    </div>
  );
}

export default LazyLoading;

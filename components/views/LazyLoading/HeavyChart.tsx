"use client"; // Wajib karena Recharts butuh interaksi browser (window)

import React, { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Kita bikin data dummy yang lumayan banyak (50 item)
// Biar keliatan chart-nya padat
const data = Array.from({ length: 50 }, (_, i) => ({
  name: `Hari ${i + 1}`,
  keuntungan: Math.floor(Math.random() * 5000) + 2000, // Random 2000 - 7000
  pengeluaran: Math.floor(Math.random() * 3000) + 1000, // Random 1000 - 4000
}));

export default function HeavyChart() {
  // Efek samping buat buktiin kalo ini baru di-load
  useEffect(() => {
    console.log(
      "🔥 HeavyChart component baru saja di-mount/download oleh browser!"
    );
    console.log("Ini membuktikan Lazy Loading bekerja.");
  }, []);

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Statistik Keuntungan (Data Berat)
      </h2>

      {/* ResponsiveContainer bikin chart ngikutin lebar parent div */}
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            interval={5} // Biar label bawah gak dempet
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `Rp${value}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="keuntungan"
            stackId="1"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="pengeluaran"
            stackId="1"
            stroke="#db2777"
            fill="#ec4899"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

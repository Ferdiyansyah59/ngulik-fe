"use client";

import { List } from "react-window";
// Ini tipe khusus buat nerima props tambahan (seperti 'names') di row
import { type RowComponentProps } from "react-window";

// 1. KITA BIKIN DATANYA DISINI (Biar gak "kurang data")
const dummyNames = Array.from(
  { length: 10000 },
  (_, index) => `User ke-${index + 1}`
);

// 2. Ini Komponen Baris (Row)
// Perhatiin: Dia nerima 'names' karena dikirim via 'rowProps' di bawah
function RowComponent({
  index,
  style,
  names, // <--- Ini data yang dilempar dari rowProps
}: RowComponentProps<{ names: string[] }>) {
  return (
    <div
      className="flex items-center justify-between px-4 border-b bg-white text-black"
      style={style}
    >
      <span>{names[index]}</span>
      <div className="text-black text-xs">
        {`${index + 1} of ${names.length}`}
      </div>
    </div>
  );
}

// 3. Ini Komponen Halaman Utamanya
function Virtualization() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        List Virtualization (Props Pattern)
      </h1>

      <div className="border border-gray-300 rounded overflow-hidden h-[400px]">
        <List
          rowComponent={RowComponent}
          rowCount={dummyNames.length}
          rowHeight={25}
          rowProps={{ names: dummyNames }}
        />
      </div>
    </div>
  );
}

export default Virtualization;

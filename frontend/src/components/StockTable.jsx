import { useEffect, useState } from "react";

export default function StockTable() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({ material: "", size: "", quality: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/purchases/available")
      .then((r) => r.json())
      .then(setRows)
      .catch(console.error);
  }, []);

  const filtered = rows.filter(
    (r) =>
      (!filter.material || r.material === filter.material) &&
      (!filter.size || r.size === filter.size) &&
      (!filter.quality || r.quality === filter.quality)
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Available Stock</h2>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="border px-2 py-1">
              <div className="flex justify-between items-center gap-2">
                <span>Material</span>
                <select
                  value={filter.material}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, material: e.target.value }))
                  }
                  className="border border-gray-300 rounded text-xs px-1 py-0.5"
                >
                  <option value="">All</option>
                  {[...new Set(rows.map((r) => r.material))].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </th>
            <th className="border px-2 py-1">
              <div className="flex justify-between items-center gap-2">
                <span>Size</span>
                <select
                  value={filter.size}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, size: e.target.value }))
                  }
                  className="border border-gray-300 rounded text-xs px-1 py-0.5"
                >
                  <option value="">All</option>
                  {[...new Set(rows.map((r) => r.size))].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </th>
            <th className="border px-2 py-1">
              <div className="flex justify-between items-center gap-2">
                <span>Quality</span>
                <select
                  value={filter.quality}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, quality: e.target.value }))
                  }
                  className="border border-gray-300 rounded text-xs px-1 py-0.5"
                >
                  <option value="">All</option>
                  {[...new Set(rows.map((r) => r.quality))].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            </th>
            <th className="border px-2 py-1">Available Qty</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{r.material}</td>
              <td className="border px-2 py-1">{r.size}</td>
              <td className="border px-2 py-1">{r.quality}</td>
              <td className="border px-2 py-1">{r.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

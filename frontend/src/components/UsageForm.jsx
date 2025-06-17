import { useEffect, useState } from "react";

export default function UsageForm() {
  const [purchases, setPurchases] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [usages, setUsages] = useState([]);
  const [filters, setFilters] = useState({ date: "", stock: "", purpose: "" });
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [newPurpose, setNewPurpose] = useState("");
  const [data, setData] = useState({
    date: "",
    purchase: "",
    purpose: "",
    quantity: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [purch, purp, used] = await Promise.all([
      fetch("https://quberail.vercel.app/api/purchases").then((r) => r.json()),
      fetch("https://quberail.vercel.app/api/purposes").then((r) => r.json()),
      fetch("https://quberail.vercel.app/api/usages").then((r) => r.json()),
    ]);
    setPurchases(purch);
    setPurposes(purp);
    setUsages(used);
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://quberail.vercel.app/api/usages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return alert("Failed to record");
    alert("Usage recorded");
    setData({ date: "", purchase: "", purpose: "", quantity: 0 });
    loadData();
  };

  const addPurpose = async () => {
    if (!newPurpose.trim()) return;
    await fetch("https://quberail.vercel.app/api/purposes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPurpose }),
    });
    await loadData();
    setData((d) => ({ ...d, purpose: newPurpose }));
    setNewPurpose("");
    setShowPurposeModal(false);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filtered = usages.filter((u) => {
    const dateMatch = !filters.date || u.date.startsWith(filters.date);
    const purposeMatch =
      !filters.purpose || u.purpose.includes(filters.purpose);
    const stockMatch =
      !filters.stock ||
      `${u.purchase?.material || ""} ${u.purchase?.size || ""} ${
        u.purchase?.quality || ""
      }`
        .toLowerCase()
        .includes(filters.stock.toLowerCase());

    return dateMatch && purposeMatch && stockMatch;
  });

  const getStockLabel = (purchId) => {
    const p = purchases.find((p) => p._id === purchId);
    return p ? `${p.material} - ${p.size} - ${p.quality}` : "Unknown";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form */}
      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold">Record Usage</h2>

        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handle}
            className="border p-1 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Select Stock</label>
          <select
            name="purchase"
            value={data.purchase}
            onChange={handle}
            className="border p-1 w-full"
            required
          >
            <option value="">Choose stock...</option>
            {purchases.map((p) => (
              <option key={p._id} value={p._id}>
                {p.material} – {p.size} – {p.quality} (Qty: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <div className="flex-1">
            <label className="block font-medium">Purpose</label>
            <select
              name="purpose"
              value={data.purpose}
              onChange={handle}
              className="border p-1 w-full"
              required
            >
              <option value="">Select purpose...</option>
              {purposes.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowPurposeModal(true)}
            className="ml-2 bg-gray-200 px-2 py-1 mt-6 rounded"
          >
            + Purpose
          </button>
        </div>

        <div>
          <label className="block font-medium">Quantity Used</label>
          <input
            type="number"
            name="quantity"
            value={data.quantity}
            onChange={handle}
            className="border p-1 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Record Usage
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Usage Records</h2>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handle}
            className="border p-1"
          />
          <input
            type="text"
            name="stock"
            value={filters.stock}
            onChange={handle}
            placeholder="Search stock"
            className="border p-1"
          />
          <input
            type="text"
            name="purpose"
            value={filters.purpose}
            onChange={handle}
            placeholder="Search purpose"
            className="border p-1"
          />
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Material</th>
              <th className="border px-2 py-1">Size</th>
              <th className="border px-2 py-1">Quality</th>
              <th className="border px-2 py-1">Purpose</th>
              <th className="border px-2 py-1">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id}>
                <td className="border px-2 py-1">{formatDate(u.date)}</td>
                <td className="border px-2 py-1">
                  {u.purchase?.material || "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {u.purchase?.size || "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {u.purchase?.quality || "N/A"}
                </td>
                <td className="border px-2 py-1">{u.purpose}</td>
                <td className="border px-2 py-1">{u.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Purpose Modal */}
      {showPurposeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow w-96">
            <h3 className="text-lg font-semibold mb-2">Add Purpose</h3>
            <input
              type="text"
              value={newPurpose}
              onChange={(e) => setNewPurpose(e.target.value)}
              className="border p-1 w-full mb-2"
              placeholder="Purpose name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPurposeModal(false)}
                className="px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={addPurpose}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

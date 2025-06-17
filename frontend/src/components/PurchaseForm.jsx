import { useEffect, useState } from "react";

export default function PurchaseForm() {
  const [materials, setMaterials] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [data, setData] = useState({
    date: "",
    material: "",
    size: "",
    quality: "",
    weight: 0,
    quantity: 0,
  });
  const [purchases, setPurchases] = useState([]);
  const [availableMap, setAvailableMap] = useState({});
  const [filters, setFilters] = useState({ date: "", material: "", size: "" });

  const [showMatModal, setShowMatModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState("");
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [newQuality, setNewQuality] = useState("");

  const sizes = materials.find((m) => m.name === data.material)?.sizes || [];
  const formatDate = (iso) => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    loadMaterials();
    loadQualities();
    loadPurchases();
  }, []);

  useEffect(() => {
    const mat = materials.find((m) => m.name === data.material);
    if (mat && !mat.sizes.includes(data.size)) {
      setData((d) => ({ ...d, size: "" }));
    }
  }, [data.material, materials]);

  const loadMaterials = async () => {
    const res = await fetch("https://quberail.vercel.app/api/materials");
    const mats = await res.json();
    setMaterials(mats);
    if (mats.length) setData((d) => ({ ...d, material: mats[0].name }));
  };

  const loadQualities = async () => {
    const res = await fetch("https://quberail.vercel.app/api/qualities");
    const qs = await res.json();
    setQualities(qs);
    if (qs.length) setData((d) => ({ ...d, quality: qs[0].name }));
  };

  const loadPurchases = async () => {
    const [purchRes, availRes] = await Promise.all([
      fetch("https://quberail.vercel.app/api/purchases").then((r) => r.json()),
      fetch("https://quberail.vercel.app/api/purchases/available").then((r) =>
        r.json()
      ),
    ]);
    setPurchases(purchRes);
    const map = {};
    availRes.forEach((item) => {
      const key = `${item.material}|${item.size}|${item.quality}`;
      map[key] = item.available;
    });
    setAvailableMap(map);
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://quberail.vercel.app/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return alert("Failed to save");
    alert("Saved");
    setData((d) => ({ ...d, weight: 0, quantity: 0 }));
    loadPurchases();
  };

  const addMaterial = async () => {
    if (!newMaterial.trim()) return;
    await fetch("https://quberail.vercel.app/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newMaterial, sizes: [] }),
    });
    await loadMaterials();
    setData((d) => ({ ...d, material: newMaterial }));
    setNewMaterial("");
    setShowMatModal(false);
  };

  const addSize = async () => {
    if (!newSize.trim()) return;
    await fetch(
      `https://quberail.vercel.app/api/materials/${encodeURIComponent(
        data.material
      )}/size`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: newSize }),
      }
    );
    await loadMaterials();
    setData((d) => ({ ...d, size: newSize }));
    setNewSize("");
    setShowSizeModal(false);
  };

  const addQuality = async () => {
    if (!newQuality.trim()) return;
    await fetch("https://quberail.vercel.app/api/qualities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newQuality }),
    });
    await loadQualities();
    setData((d) => ({ ...d, quality: newQuality }));
    setNewQuality("");
    setShowQualityModal(false);
  };

  const filtered = purchases.filter((p) => {
    const dateMatch = !filters.date || p.date.startsWith(filters.date);
    const matMatch = !filters.material || p.material.includes(filters.material);
    const sizeMatch = !filters.size || p.size.includes(filters.size);
    return dateMatch && matMatch && sizeMatch;
  });

  const getAvailable = (p) => {
    const key = `${p.material}|${p.size}|${p.quality}`;
    return availableMap[key] ?? "-";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form */}
      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold">Add Purchase</h2>

        <div>
          <label className="block">Date</label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handle}
            className="border p-1 w-full"
            required
          />
        </div>

        <div className="flex items-center">
          <div className="flex-1">
            <label className="block">Material</label>
            <select
              name="material"
              value={data.material}
              onChange={handle}
              className="border p-1 w-full"
            >
              {materials.map((m) => (
                <option key={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowMatModal(true)}
            className="ml-2 bg-gray-200 px-2 py-1 mt-5 rounded"
          >
            + Material
          </button>
        </div>

        <div className="flex items-center">
          <div className="flex-1">
            <label className="block">Size</label>
            <select
              name="size"
              value={data.size}
              onChange={handle}
              className="border p-1 w-full"
              required
            >
              <option value="">Select size</option>
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowSizeModal(true)}
            className="ml-2 bg-gray-200 px-2 py-1  mt-5 rounded"
          >
            + Size
          </button>
        </div>

        <div className="flex items-center">
          <div className="flex-1">
            <label className="block">Quality</label>
            <select
              name="quality"
              value={data.quality}
              onChange={handle}
              className="border p-1 w-full"
            >
              {qualities.map((q) => (
                <option key={q.name}>{q.name}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowQualityModal(true)}
            className="ml-2 bg-gray-200 px-2 py-1  mt-5  rounded"
          >
            + Quality
          </button>
        </div>

        <div>
          <label className="block">Weight</label>
          <input
            type="number"
            name="weight"
            value={data.weight}
            onChange={handle}
            className="border p-1 w-full"
            required
          />
        </div>

        <div>
          <label className="block">Quantity</label>
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
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Save Purchase
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Purchase List</h2>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilter}
            className="border p-1"
          />
          <input
            type="text"
            name="material"
            value={filters.material}
            onChange={handleFilter}
            placeholder="Material"
            className="border p-1"
          />
          <input
            type="text"
            name="size"
            value={filters.size}
            onChange={handleFilter}
            placeholder="Size"
            className="border p-1"
          />
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Material</th>
              <th className="border px-2 py-1">Size</th>
              <th className="border px-2 py-1">Quality</th>
              <th className="border px-2 py-1">Weight</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Available</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id}>
                <td className="border px-2 py-1">{formatDate(p.date)}</td>
                <td className="border px-2 py-1">{p.material}</td>
                <td className="border px-2 py-1">{p.size}</td>
                <td className="border px-2 py-1">{p.quality}</td>
                <td className="border px-2 py-1">{p.weight}</td>
                <td className="border px-2 py-1">{p.quantity}</td>
                <td className="border px-2 py-1">{getAvailable(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Material Modal */}
      {showMatModal && (
        <Modal
          title="Add Material"
          onClose={() => setShowMatModal(false)}
          onSave={addMaterial}
        >
          <input
            type="text"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            className="border p-1 w-full"
          />
        </Modal>
      )}

      {/* Size Modal */}
      {showSizeModal && (
        <Modal
          title={`Add Size for ${data.material}`}
          onClose={() => setShowSizeModal(false)}
          onSave={addSize}
        >
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            className="border p-1 w-full"
          />
        </Modal>
      )}

      {/* Quality Modal */}
      {showQualityModal && (
        <Modal
          title="Add Quality"
          onClose={() => setShowQualityModal(false)}
          onSave={addQuality}
        >
          <input
            type="text"
            value={newQuality}
            onChange={(e) => setNewQuality(e.target.value)}
            className="border p-1 w-full"
          />
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, onSave, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {children}
        <div className="flex justify-end space-x-2 mt-3">
          <button onClick={onClose} className="px-3 py-1">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

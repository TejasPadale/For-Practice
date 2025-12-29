import { useState } from "react";
import API from "../services/api";

export default function AddProductModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    taxRate: "",
  });

  const save = async () => {
    await API.post("/products", form);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-105">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Add Product</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {[
            { key: "name", label: "Product Name" },
            { key: "price", label: "Price" },
            { key: "stock", label: "Stock Quantity" },
            { key: "taxRate", label: "Tax %" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">
                {label}
              </label>
              <input
                type="text"
                placeholder={label}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Save Product
          </button>
        </div>

      </div>
    </div>
  );
}

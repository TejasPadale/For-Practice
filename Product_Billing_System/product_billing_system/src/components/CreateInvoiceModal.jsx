import { useEffect, useState } from "react";
import API from "../services/api";

export default function CreateInvoiceModal({ onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const add = (p) => {
    if (p.stock === 0) return;
    if (items.find((i) => i._id === p._id)) return;

    setItems([...items, { ...p, quantity: 1 }]);
  };

  const updateQty = (id, qty) => {
    setItems(
      items.map((i) =>
        i._id === id
          ? { ...i, quantity: Math.min(Number(qty), i.stock) }
          : i
      )
    );
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = items.reduce(
    (s, i) => s + (i.price * i.quantity * i.taxRate) / 100,
    0
  );
  const total = subtotal + tax;

  const save = async () => {
    if (!customerName || items.length === 0) return;

    await API.post("/invoices", {
      customerName,
      items: items.map((i) => ({
        productId: i._id,
        quantity: i.quantity,
      })),
    });

    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-180 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">Create Invoice</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Customer */}
          <div>
            <label className="text-sm font-medium">Customer Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter customer name"
            />
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-2">Select Products</h4>
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <button
                  key={p._id}
                  disabled={p.stock === 0}
                  onClick={() => add(p)}
                  className={`border rounded-lg p-3 text-left transition
                    ${p.stock === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"}`}
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">
                    ₹{p.price} • Tax {p.taxRate}%
                  </div>
                  <div className={`text-xs mt-1 ${p.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                    Stock: {p.stock}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Items */}
          {items.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Selected Items</h4>
              <div className="space-y-2">
                {items.map((i) => (
                  <div
                    key={i._id}
                    className="flex justify-between items-center border rounded px-3 py-2"
                  >
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-gray-500">
                        Available: {i.stock}
                      </div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max={i.stock}
                      value={i.quantity}
                      onChange={(e) =>
                        updateQty(i._id, e.target.value)
                      }
                      className="w-20 border rounded px-2 py-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="bg-gray-50 rounded p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!customerName || items.length === 0}
            className="bg-green-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
          >
            Save Invoice
          </button>
        </div>

      </div>
    </div>
  );
}

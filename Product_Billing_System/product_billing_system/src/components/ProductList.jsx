import { useEffect, useState } from "react";
import API from "../services/api";
import EditProductModal from "./EditProductModal";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await API.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Products</h2>
        <p className="text-sm text-gray-500">
          Manage available products and stock
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Price</th>
              <th className="px-4 py-3 text-center">Stock</th>
              <th className="px-4 py-3 text-center">Tax %</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No products available
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-center">₹{p.price}</td>
                <td className="px-4 py-3 text-center">{p.stock}</td>
                <td className="px-4 py-3 text-center">{p.taxRate}%</td>
                <td className="px-4 py-3 text-center space-x-3">
                  <button
                    onClick={() => setEditProduct(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={load}
        />
      )}
    </div>
  );
}

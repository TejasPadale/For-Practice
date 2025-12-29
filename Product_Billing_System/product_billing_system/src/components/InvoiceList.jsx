import { useEffect, useState } from "react";
import API from "../services/api";
import InvoiceViewModal from "./InvoiceViewModal";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [viewInvoice, setViewInvoice] = useState(null);

  useEffect(() => {
    API.get("/invoices").then((res) => setInvoices(res.data));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md">

      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Bills</h2>
        <p className="text-sm text-gray-500">
          Generated invoices with customer details
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Invoice No</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((i) => (
              <tr key={i._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">#{i.invoiceNumber}</td>
                <td className="px-4 py-3">{i.customerName}</td>
                <td className="px-4 py-3 text-center">
                  {new Date(i.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{i.grandTotal.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setViewInvoice(i)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewInvoice && (
        <InvoiceViewModal
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
}

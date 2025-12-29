export default function InvoiceViewModal({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[700px]">

        {/* Header */}
        <div className="flex justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Invoice #{invoice.invoiceNumber}
          </h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          <div className="flex justify-between text-sm">
            <div>
              <p className="font-medium">Customer</p>
              <p>{invoice.customerName}</p>
            </div>
            <div>
              <p className="font-medium">Date</p>
              <p>{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>

          <table className="w-full text-sm border mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Tax</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((i, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{i.name}</td>
                  <td className="p-2 text-center">{i.quantity}</td>
                  <td className="p-2 text-right">₹{i.price}</td>
                  <td className="p-2 text-right">₹{i.tax.toFixed(2)}</td>
                  <td className="p-2 text-right">₹{i.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right space-y-1">
            <p>Subtotal: ₹{invoice.subtotal.toFixed(2)}</p>
            <p>Tax: ₹{invoice.totalTax.toFixed(2)}</p>
            <p className="font-bold text-lg">
              Grand Total: ₹{invoice.grandTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

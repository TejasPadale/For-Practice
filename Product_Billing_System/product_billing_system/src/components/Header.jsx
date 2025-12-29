export default function Header({ onAdd, onInvoice }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Product Billing System</h1>

      <div className="space-x-3">
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>
        <button
          onClick={onInvoice}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create New Bill
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import Header from "../components/Header";
import ProductList from "../components/ProductList";
import InvoiceList from "../components/InvoiceList";
import AddProductModal from "../components/AddProductModal";
import CreateInvoiceModal from "../components/CreateInvoiceModal";

export default function Dashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header
        onAdd={() => setShowAdd(true)}
        onInvoice={() => setShowInvoice(true)}
      />

      <div className="grid grid-cols-1 gap-6 mt-6">
        <ProductList />
        <InvoiceList />
      </div>

      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} />}
      {showInvoice && (
        <CreateInvoiceModal onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
}

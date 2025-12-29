const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

// CREATE INVOICE
exports.createInvoice = async (req, res) => {
  try {
    const { items, customerName } = req.body;

    // Validation
    if (!customerName) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invoice items are required" });
    }

    // Auto-increment invoice number
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;

    let subtotal = 0;
    let totalTax = 0;
    const invoiceItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemSubtotal = product.price * item.quantity;
      const tax = (itemSubtotal * product.taxRate) / 100;
      const total = itemSubtotal + tax;

      subtotal += itemSubtotal;
      totalTax += tax;

      invoiceItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        taxRate: product.taxRate,
        subtotal: itemSubtotal,
        tax,
        total,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const invoice = await Invoice.create({
      invoiceNumber: nextInvoiceNumber,
      customerName,
      items: invoiceItems,
      subtotal,
      totalTax,
      grandTotal: subtotal + totalTax,
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL INVOICES
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices" });
  }
};

// GET INVOICE BY ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice" });
  }
};

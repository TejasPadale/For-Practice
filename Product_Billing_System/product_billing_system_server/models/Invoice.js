const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true // IMPORTANT for uniqueness
    },

    customerName: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        taxRate: Number,
        subtotal: Number,
        tax: Number,
        total: Number
      }
    ],

    subtotal: {
      type: Number,
      required: true
    },

    totalTax: {
      type: Number,
      required: true
    },

    grandTotal: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);

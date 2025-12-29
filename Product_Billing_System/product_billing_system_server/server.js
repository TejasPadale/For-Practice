const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

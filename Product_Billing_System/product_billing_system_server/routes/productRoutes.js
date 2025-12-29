const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

router.post("/", controller.addProduct);
router.get("/", controller.getProducts);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;

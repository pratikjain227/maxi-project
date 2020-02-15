const express = require("express");

const serverController = require("../controllers/server");

const router = express.Router();

router.get("/", serverController.getIndex);

module.exports = router;

const express = require("express");

const serverController = require("../controllers/server");

const router = express.Router();

router.get("/", function(req, res) {
  serverController.findServer();
});

module.exports = router;

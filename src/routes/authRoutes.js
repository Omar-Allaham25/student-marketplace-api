const express = require("express");
const authcontrollers = require("../controllers/authcontroller");

const router = express.Router();

router.post("/register", authcontrollers.register);
router.post("/login", authcontrollers.login);

module.exports = router;

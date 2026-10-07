const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  getAllTickets,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/users",
  protect,
  authorizeRole("admin"),
  getAllUsers
);

router.get(
  "/tickets",
  protect,
  authorizeRole("admin"),
  getAllTickets
);

module.exports = router;
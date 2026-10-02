const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const {
  getAssignedTickets,
  getAssignedCustomerProfile,
} = require("../controllers/agentController");

const router = express.Router();

// Agent can view only tickets assigned to them
router.get(
  "/tickets",
  protect,
  authorizeRole("agent"),
  getAssignedTickets
);

router.get(
  "/tickets/:ticketId/customer",
  protect,
  authorizeRole("agent"),
  getAssignedCustomerProfile
);

module.exports = router;
const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createTicket,
  getMyTickets,
  getMyTicket,
  updateMyTicket,
  deleteMyTicket,
  sendMessage,
  getTicketMessages,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getMyTickets);
router.get("/:id", protect, getMyTicket);
router.put("/:id", protect, updateMyTicket);
router.delete("/:id", protect, deleteMyTicket);
router.post("/:ticketId/messages", protect, sendMessage);
router.get("/:ticketId/messages", protect, getTicketMessages);

module.exports = router;
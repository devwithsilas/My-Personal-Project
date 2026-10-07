const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  updateProfile,
  deactivateAccount,
} = require("../controllers/userController");

const router = express.Router();

// Update logged-in user's profile
router.put("/profile", protect, updateProfile);

// Deactivate logged-in user's account
router.patch("/deactivate", protect, deactivateAccount);

module.exports = router;
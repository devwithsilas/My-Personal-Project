const User = require("../models/User");
const Ticket = require("../models/Ticket");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve users",
    });
  }
};


// GET ALL TICKETS
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("customer", "firstName lastName email phone")
      .populate("assignedAgent", "firstName lastName email");

    res.status(200).json({
      message: "Tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve tickets",
    });
  }
};

module.exports = {
  getAllUsers,
  getAllTickets,
};
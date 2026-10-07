const Ticket = require("../models/Ticket");

// GET ASSIGNED TICKETS
const getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      assignedAgent: req.user.id,
    })
      .populate("customer", "firstName lastName email phone")
      .populate("assignedAgent", "firstName lastName email");

    res.status(200).json({
      message: "Assigned tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve assigned tickets",
    });
  }
};

// GET ASSIGNED CUSTOMER PROFILE
const getAssignedCustomerProfile = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.ticketId,
      assignedAgent: req.user.id,
    }).populate(
      "customer",
      "firstName lastName email phone dob age status role"
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found or not assigned to you",
      });
    }

    res.status(200).json({
      message: "Customer profile retrieved successfully",
      customer: ticket.customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve customer profile",
    });
  }
};

module.exports = {
  getAssignedTickets,
  getAssignedCustomerProfile,
};
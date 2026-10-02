const Ticket = require("../models/Ticket");

// CREATE TICKET
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, attachments } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      attachments,
      customer: req.user.id,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error)  {
    console.error(error);
    res.status(500).json({
      message: "Failed to create ticket",
    });
  }
};

// GET CUSTOMERS TICKETS
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      customer: req.user.id,
    }).populate("assignedAgent", "firstName lastName email");

    res.status(200).json({
      message: "Tickets retrieved successfully",
      tickets,
    });
  } catch (error)  {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve tickets",
    });
  }
};

// GET ONE CUSTOMER TICKET
const getMyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      customer: req.user.id,
    }).populate("customer", "firstName lastName email phone")
      .populate("assignedAgent", "firstName lastName email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket retrieved successfully",
      ticket,
    });
  } catch (error)  {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve ticket",
    });
  }
};

// UPDATE CUSTOMERS TICKET
const updateMyTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const updates = {};

    if (title !== undefined) {
      updates.title = title;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (priority !== undefined) {
      updates.priority = priority;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields provided for updates",
      });
    }

    const ticket = await Ticket.findOneAndUpdate(
      {
        _id: req.params.id,
        customer: req.user.id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error)  {
    console.error(error);
    res.status(500).json({
      message: "Failed to updated ticket",
    });
  }
};

// DELETE CUSTOMERS TICKET
const deleteMyTicket = async (req, res) => {
  try{
    const ticket = await Ticket.findOneAndDelete({
      _id: req.params.id,
      customer: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error)  {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete ticket",
    });
  }
};


// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Check if the user is the customer
    const isCustomer =
      ticket.customer.toString() === req.user.id;

    // Check if the user is the assigned agent
    const isAssignedAgent =
      ticket.assignedAgent &&
      ticket.assignedAgent.toString() === req.user.id;

    // Only the customer or assigned agent can send messages
    if (!isCustomer && !isAssignedAgent) {
      return res.status(403).json({
        message: "You are not authorized to message on this ticket",
      });
    }

    ticket.message.push({
      sender: req.user.id,
      message: message.trim(),
    });

    await ticket.save();

    res.status(201).json({
      message: "Message sent successfully",
      newMessage: ticket.message[ticket.message.length - 1],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
};


// GET TICKET MESSAGES
const getTicketMessages = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate("message.sender", "firstName lastName email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Check if the user is the customer
    const isCustomer =
      ticket.customer.toString() === req.user.id;

    // Check if the user is the assigned agent
    const isAssignedAgent =
      ticket.assignedAgent &&
      ticket.assignedAgent.toString() === req.user.id;

    // Only the customer or assigned agent can see messages
    if (!isCustomer && !isAssignedAgent) {
      return res.status(403).json({
        message: "You are not authorized to view messages on this ticket",
      });
    }

    res.status(200).json({
      message: "Messages retrieved successfully",
      messages: ticket.message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve messages",
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getMyTicket,
  updateMyTicket,
  deleteMyTicket,
  sendMessage,
  getTicketMessages,
};
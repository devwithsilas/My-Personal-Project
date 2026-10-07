require("dotenv").config();

const express = require("express")
const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes")
const ticketRoutes = require("./routes/ticketRoutes")
const userRoutes = require("./routes/userRoutes");
const agentRoutes = require("./routes/agentRoutes");
const adminRoutes = require("./routes/adminRoutes");



const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Customer Support Ticketing API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
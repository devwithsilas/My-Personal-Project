const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      email,
      age,
      phone,
      password,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({email});

    if ( existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 3);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      dob,
      age,
      email,
      phone,
      password: hashedPassword,
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({email});

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if account is deactivated
    if (user.status === "closed") {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login failed",
    });
  }
};



module.exports = {
  register,
  login,
};
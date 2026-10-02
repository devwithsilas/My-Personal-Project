const User = require("../models/User");

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent updating protected fields
    const {
      firstName,
      lastName,
      dob,
      age,
      phone,
    } = req.body;

    // Update only fields that were provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (dob !== undefined) user.dob = dob;
    if (age !== undefined) user.age = age;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        age: user.age,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Profile update failed",
    });
  }
};

// DEACTIVATE ACCOUNT
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Deactivate the account instead of deleting the user
    user.status = "closed";

    await user.save();

    res.status(200).json({
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Account deactivation failed",
    });
  }
};

module.exports = {
  updateProfile,
  deactivateAccount,
};
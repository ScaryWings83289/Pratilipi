// Libraies
const express = require("express");
const router = express.Router();

// MongoDB User Model
const User = require("../models/user");

// Middleware
const { isAuthenticated, validator } = require("../middlewares/user");

// Signup Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Validating first name, last name, email & phone number
    const validation = validator(firstName, lastName, email, phoneNumber);
    if (validation === true) {
      // Check if user already exists
      const user = await User.findOne({ email });
      if (user) {
        // A user already exists
        return res.json({
          status: "FAILED",
          message: "User with the given email address already exists!",
        });
      } 
      // Try to create new User
      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
      });
      await newUser.save();
      res.json({
        status: "SUCCESS",
        message: "User has been succesfully registered!",
      });
    } else {
      res.json({
        status: "FAILED",
        message: validation,
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// Login a User
router.post("/login", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (email === "" || phoneNumber === "") {
      return res.json({
        status: "FAILED",
        message: "Empty input credentials!",
      });
    } else {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({
          status: "FAILED",
          message: "User with that email Address does not Exist!",
        });
      } 
      // Compare phone number if user exists
      if (user.phoneNumber === phoneNumber) {
        // Phone Number matches
        req.session.isAuth = true;
        req.session.userId = user._id;
        res.json({
          status: "SUCCESS",
          message: `Welcome to the Pratilipi ${user.firstName}!`,
        });
      } else {
        res.json({
          status: "FAILED",
          message: "Invalid Phone Number",
        });
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// Logout a User
router.get("/logout", isAuthenticated, (req, res) => {
  try {
    req.session.destroy();
    res.json({
      status: "SUCCESS",
      message: "Successfully Logout!",
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// Read a User's data
router.get("/getUser", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.json({
        status: "FAILED",
        message: "User doesn't exist",
      });
    } ; 
    res.json({
      status: "SUCCESS",
      data: {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "phoneNumber": user.email
      }
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// Update a particular User's data
router.put("/updateUser", isAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    const validation = validator(firstName, lastName, email, phoneNumber);
    if (validation === true) {
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.json({
          status: "FAILED",
          message: "User does not Exist!",
        });
      } 
      // Updating User's data
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phoneNumber = phoneNumber;
      await user.save();
      res.json({
        status: "SUCCESS",
        message: `${user.firstName}, your data has been successfully updated.`,
      });
    } else {
      res.json({
        status: "FAILED",
        message: validation,
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

router.delete('/deleteUser', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.json({
        status: "FAILED",
        message: "User doesn't exist",
      });
    }
    // A User already exists
    await User.findByIdAndDelete(req.session.userId);
    res.json({
        status: "SUCCESS",
        message: "User's data deleted successfully",
    });
  } catch (err) {
    return res.json({
      status: 500,
      message: err.message,
    });
  }
});

module.exports = router;

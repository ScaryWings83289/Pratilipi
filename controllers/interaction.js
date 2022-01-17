// Libraries
const express = require("express");
const router = express.Router();

// MongoDB Interaction Model
const Content = require("../models/content");
const Interaction = require("../models/interaction");

// Middleware
const { isAuthenticated } = require("../middlewares/user");

// Test Route
router.get("/", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: "This is the Interaction Test Route",
  });
});

// User Read Books
router.get("/read/:id", isAuthenticated, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.json({
        status: "FAILED",
        message: "Content doesn't exist",
      });
    };
    content.views += 1;
    await content.save();
    const interaction = await Interaction.findOne({ userId: req.session.userId});
    if (interaction) {
      interaction.readBooks.push(content.title);
      await interaction.save();
      return res.json({
        status: "SUCCESS",
        message: `You're reading ${content.title}`,
      });
    };
    const newInteraction = new Interaction({
      userId: req.session.userId,
      readBooks: content.title,
    })
    await newInteraction.save();
    return res.json({
      status: "SUCCESS",
      message: `You're reading ${content.title}`,
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// User Liked Books
router.put("/like/:id", isAuthenticated, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    content.likes += 1;
    await content.save();
    const interaction = await Interaction.findOne({ userId: req.session.userId});
    if (interaction) {
      interaction.likedBooks.push(content.title);
      await interaction.save();
      return res.json({
        status: "SUCCESS",
        message: `You've liked ${content.title}`,
      });
    };
    const newInteraction = new Interaction({
      userId: req.session.userId,
      likedBooks: content.title,
    })
    await newInteraction.save();
    return res.json({
      status: "SUCCESS",
      message: `You've liked ${content.title}`,
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

module.exports = router;
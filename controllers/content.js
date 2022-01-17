// Libraies
const fs = require("fs");
const express = require("express");
const multer  = require("multer");
const upload = multer({ dest: 'uploads/' });
const csv = require("fast-csv");
const router = express.Router();

// MongoDB Content Model
const Content = require("../models/content");

// Middleware
const { contentValidator, dateFormatter } = require("../middlewares/content");
const { isAuthenticated } = require("../middlewares/user");

// Saving CSV Data to Database
router.post('/postData', upload.any(), async (req, res) => {
  try {
    if (req.files[0] === undefined) {
      return res.json({
        status: "FAILED",
        message: "Please select a file to upload data to DB!",
      });
    }
    // Open uploaded file
    csv.parseFile(req.files[0].path).on("data", async (data) => {
      const individalData = {
        userId: data[0],
        title: data[1],
        story: data[2],
        datePublished: dateFormatter(data[3]),
      };
      const content = await Content.findOne(individalData);
      // Avoiding Duplicate Data
      if (!content) {
        const newContent = new Content(individalData);
        await newContent.save();
      }
    }).on("end", () => {
      fs.unlinkSync(req.files[0].path);
      res.json({
        status: "STATUS",
        message: "Data has been appended to the DB successfully!",
      })
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
})

// Create a Content
router.post("/createContent", isAuthenticated, async (req, res) => {
  try {
    const { title, story } = req.body;

    // Validating Title & Story
    const validation = contentValidator(title, story);
    if (validation === true) {
      // Check if content already exists
      const content = await Content.find({ $or: [{ title }, { story } ]});
      if (content.length > 0) {
        // A content already exists
        return res.json({
          status: "FAILED",
          message: "Title or Story has already been published!",
        });
      } 
      // Try to create new Content
      const newContent = new Content({
        userId: req.session.userId,
        title,
        story,
      });
      await newContent.save();
      res.json({
        status: "SUCCESS",
        message: "Content has been succesfully created!",
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

// Read a Particular Content
router.get("/readContent/:id", isAuthenticated, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.json({
        status: "FAILED",
        message: "Content doesn't exist",
      });
    };
    res.json({
      status: "SUCCESS",
      data: {
        "title": content.title,
        "story": content.story,
      }
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// Update a particular Content
router.put("/updateContent", isAuthenticated, async (req, res) => {
  try {
    const { title, story } = req.body;

    const validation = contentValidator(title, story);
    if (validation === true) {
      const content = await Content.findOne({ userId: req.session.userId });
      if (!content) {
        return res.json({
          status: "FAILED",
          message: "Content does not Exist!",
        });
      } 
      // Updating User's data
      content.title = title;
      content.story = story;
      await content.save();
      res.json({
        status: "SUCCESS",
        message: "Content has been successfully updated.",
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

// Delete a particular Content
router.delete('/removeContent', isAuthenticated, async (req, res) => {
  try {
    const content = await Content.findOne({ userId: req.session.userId });
    if (!content) {
      return res.json({
        status: "FAILED",
        message: "Content doesn't exist",
      });
    }
    // A Content already exists
    await Content.findOneAndDelete({ userId: req.session.userId });
    res.json({
      status: "SUCCESS",
      message: "Content has been deleted successfully!",
    });
  } catch (err) {
    return res.json({
      status: 500,
      message: err.message,
    });
  }
});

router.get('/newContents', async (req, res) => {
  try {
    const content = await Content.find().select('title views likes datePublished').sort({ datePublshed: -1 });
    if (!content) {
      return res.json({
        status: "FAILED",
        message: "Content doesn't exist",
      });
    }
    // A Content already exists
    res.json({
      status: "SUCCESS",
      data: content
    });
  } catch (err) {
    return res.json({
      status: 500,
      message: err.message,
    });
  }
});

router.get('/topContents', async (req, res) => {
  try {
    const content = await Content.find().select('userId title views likes').sort({ views: -1, likes: -1 });
    if (!content) {
      return res.json({
        status: "FAILED",
        message: "Content doesn't exist",
      });
    }
    // A Content already exists
    res.json({
      status: "SUCCESS",
      data: content
    });
  } catch (err) {
    return res.json({
      status: 500,
      message: err.message,
    });
  }
});

module.exports = router;

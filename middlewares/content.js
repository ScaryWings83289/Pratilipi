// MongoDB Content Model
const Content = require("../models/content");

// Checking Valid Email & Phone Number
const contentValidator = (title, story) => {
  // Checking if input fields are empty or not
  if (title === "" || story === "") {
    return "Title & Story cannot be empty!";
  }
  return true;
}

const dateFormatter = (dateString) => {
  const pad = (d) => (d < 10) ? '0' + d : d;
  const d = new Date(dateString);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}

module.exports = { contentValidator, dateFormatter };
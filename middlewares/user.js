// Checking if a user is logged in or not
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuth === true) {
    return next();
  }
  res.json({ 
    status: "FAILED",
    message: "You're not logged in! Please login to proceed further."
  });
}

// Checking Valid Email & Phone Number
const validator = (firstName, lastName, email, phoneNumber) => {
  // Checking if input fields are empty or not
  if (firstName === "" || lastName === "" || email === "" || phoneNumber === "") {
    return "Name, Email & Phone Number cannot be empty!";
  }
  // Checking if user entered a valid email Address 
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return "Please enter a valid email ID!";
  }
  // Checking if user entered valid phone Number 
  else if (!/^\d{10}$/.test(phoneNumber)) {
    return 'Invalid Mobile Number';
  }
  return true;
}

module.exports = { isAuthenticated, validator };
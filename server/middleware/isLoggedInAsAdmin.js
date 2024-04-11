const isLoggedInAsAdmin = (req, res, next) => {
  console.log("From admin middleware", req.user);

  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }

  res.status(401).send("User is not an admin");
};

module.exports = isLoggedInAsAdmin;

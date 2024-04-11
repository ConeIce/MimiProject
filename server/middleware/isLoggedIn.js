const isLoggedIn = (req, res, next) => {
  console.log("From user middleware", req.user);

  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send("User is not authenticated");
};

module.exports = isLoggedIn;

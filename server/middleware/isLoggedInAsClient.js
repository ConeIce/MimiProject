const isLoggedInAsClient = (req, res, next) => {
  console.log("From client middleware", req.user);

  if (req.isAuthenticated() && req.user.role === "client") {
    return next();
  }

  res.status(401).send("User is not an client");
};

module.exports = isLoggedInAsClient;

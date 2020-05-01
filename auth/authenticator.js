module.exports = {auth}

function auth(req, res, next) {
    console.log("session", req.session);
  
    if (req.session.loggedIn === true) {
      next();
    } else {
      res.status(401).json({ message: "You cannot pass!!" });
    }
  };
  
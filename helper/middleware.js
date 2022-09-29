const csurf = require("csurf");


module.exports = class MiddleWares {

  //CSRF
  csrfMiddleware = csurf({
    cookie: {
      sameSite: "none",
      secure: "auto",
    },
  });

  //retrieve profile from session
  profileMiddleware = (req, res, next) => {
    req.profile = {
      firstName: req.session.firstName,
      lastName: req.session.lastName,
      email: req.session.email,
    };
    next();
  };


}


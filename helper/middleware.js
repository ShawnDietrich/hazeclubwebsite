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
    if (req.session.loggedin) {
      req.profile = {
        id: req.session.user.id,
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        email: req.session.user.email,
      };
    }
    next();
  };


}


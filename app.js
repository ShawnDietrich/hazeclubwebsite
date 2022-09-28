var createError = require('http-errors');
var express = require('express');
const session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


require('dotenv').config();





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 4320000000,
      secure: 'auto',
      httpOnly: true,
    },
  })
);


//CSRF middleware
app.use((error, request, response, next) => {
  console.log(error)
  if (error.code === "EBADCSRFTOKEN") {
    console.log(req.body)
    response.status(403);
    response.send("The CSRF token is invalid");
  } else {
    next();
  }
});


//require routes
//var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')


//React routes - not used

//Express Routes
app.use('/auth', authRouter);

//home page render
app.get('/', (req, res)=> {
  res.status(200).render('home');
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

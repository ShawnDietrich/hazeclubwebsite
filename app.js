var createError = require('http-errors');
const express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


require('dotenv').config();





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

//don't convert body to json if url is destended for a webhook
app.use((req, res, next) => {
  req.originalUrl === '/register/payment' ? next() : express.json()(req, res, next);
})
app.use(express.urlencoded({ extended: true }));
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




//require routes
//var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')
var registerRouter = require('./routes/register')
var userRouter = require('./routes/users')
var eventsRouter = require('./routes/events')
//React routes - not used

//Express Routes
app.use('/auth', authRouter);
app.use('/register', registerRouter);
app.use('/users', userRouter);
app.use('/events', eventsRouter);

//home page render
app.get('/', (req, res) => {
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

var express = require('express');
var router = express.Router();
const Middleware = require('../helper/middleware.js')
const middleware = new Middleware()
const bcrypt = require('bcryptjs')
const userAlerts = require('../helper/alerts').userAlert
//database class require
const userDBInst = require('../database/users')

//database class instance
const userDB = new userDBInst()

//Middleware to check
router.all('/*', middleware.csrfMiddleware, middleware.profileMiddleware, (req, res, next) => {
  req.session.loggedin ? next() : res.status(400).redirect('/auth/login')
})

/* Add users after purchase is successfull */
router.get('/', function(req, res, next) {

  //Request CSRF token
  const csrfToken = req.csrfToken()
  res.status(200).render('user', {
    csrfToken: csrfToken,
    profile: req.profile,
    alerts: userAlerts,
  })
  userAlerts.init;
});

router.post('/update', async function(req, res){
  var userData = req.body
  var passwordCheck
  //get current user password
  const user = await userDB.findByEmail(req.profile.email)
  if(user) {
    //check old password matches
    if(userData.oldPassword){
      passwordCheck = await bcrypt.compare(userData.oldPassword, user.password)
    }else{
      //update userData with user data
      userData = {...userData, id: user.id}
      userData.password = user.password
    }

    //remove old password 
    if(passwordCheck){
      userData = {...userData, id: user.id}
    }
    
    if(passwordCheck || !userData.oldPassword){
      const updateResult = await userDB.update(userData)
      if(updateResult){
        console.log('user updated')
        userAlerts._updatePass()
        req.session.firstName = userData.firstName
        req.session.lastName = userData.lastName
        res.status(200).redirect('/users')
      }else {
        console.log('update failed')
        userAlerts._updateFail()
        res.status(200).redirect('/users')
      }
    }else{
      console.log('Passowrd check failed' + userData.email)
      userAlerts._OldPass()
      res.status(400).redirect('/users')
    }
  }else{
    console.log('email does not exist')
    userAlerts._updateFail()
    res.status(400).redirect('/users')
  }
})
module.exports = router;

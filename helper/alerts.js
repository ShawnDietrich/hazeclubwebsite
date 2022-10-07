var regAlert = {
  emailExists: false,
  _reset: function () {
    this.emailExists = false;
  },
  _emailExists: function () {
    this.emailExists = true;
  },
};

var userAlert = {
  init: {
    oldPassword: false,
    updatePass: false,
    updateFail: false,
  },

  _OldPass: function () {
    this.oldPassword = true;
    this.updatePass = false;
    this.updateFail = false;
  },
  _updateFail: function () {
    this.oldPassword = false;
    this.updatePass = false;
    this.updateFail = true;
  },
  _updatePass: function () {
    this.oldPassword = false;
    this.updatePass = true;
    this.updateFail = false;
  },
};

var eventsAlert = {
  init: {

  },

}

module.exports = { regAlert, userAlert, eventsAlert };

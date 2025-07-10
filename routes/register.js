var express = require('express');
var router = express.Router();

var path = require('path');
var user = require('../models/user');
var bcrypt = require('bcrypt');
var fs = require('fs');

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

router.post('/', async function (req, res) {
  const { name, email, password } = req.body;
  const userExist = await user.findOne({ email });

  if (!userExist) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new user({ name, email, password: hashedPassword });
    const userRegistered = await newuser.save();
    console.log("Registered : ", userRegistered);
    res.redirect('/login');
  } else {
    res.send(`
      <div class="error-page-section" style="font-family: 'Inter', sans-serif; height: 95vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #F9FAFB;">
        <img src="./images/Computer troubleshooting-rafiki.svg" alt="loading img.." height="75%" width="70%">
        <h1>Email already Exist !</h1>
        <h1><a href="/register">Back</a></h1>
      </div>
      `);
  }

});

module.exports = router;

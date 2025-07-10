var express = require('express');
var router = express.Router();

var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var user = require('../models/user');
require('dotenv').config();

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.post('/', async function (req, res) {
  const { email, password } = req.body;
  const userFound = await user.findOne({ email });

  if (userFound) {
    passwordMatched = await bcrypt.compare(password, userFound.password);

    if (passwordMatched) {
      //jwt token
      const token = jwt.sign(
        {
          name: userFound.name,
          email: userFound.email,
          password: userFound.password
        },
        `${process.env.jwtSecretKey}`,
        { expiresIn: "1h" }
      );
      console.log('TOKEN : ', token);

      //cookie
      res.cookie('Uid',userFound._id,{
          maxAge : 3600000, //1h
          httpOnly : true, 
          secure : false, //https
          sameSite : true //CSRF
        });
        
      res.cookie('token', token,
        {
          maxAge : 3600000, //1h
          httpOnly : true, 
          secure : false, //https
          sameSite : true //CSRF
        });

      res.redirect('/notes');

    } else {
      res.send(`
      <div class="error-page-section" style="font-family: 'Inter', sans-serif; height: 95vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #F9FAFB;">
        <img src="./images/Computer troubleshooting-rafiki.svg" alt="loading img.." height="75%" width="70%">
        <h1>Invalid Password !</h1>
        <h1><a href="/login">Back</a></h1>
      </div>
      `);
    }
  } else {
    res.send(`
      <div class="error-page-section" style="font-family: 'Inter', sans-serif; height: 95vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #F9FAFB;">
        <img src="./images/Computer troubleshooting-rafiki.svg" alt="loading img.." height="75%" width="70%">
        <h1>User Not Found !</h1>
        <p>Please <a href="/register">create</a> a account and then login</p>
        <h1><a href="/login">Back</a></h1>
      </div>
      `);
  }
});

module.exports = router;

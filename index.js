'use strict';

const amqplib = require('amqplib/callback_api');
const config = require('./config');
const { spawn } = require('child_process');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
let result = '';  

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
  let data = {'em':'kudayisitobi@gmail.com','title':'Nodemailer says HI','content':'<h3>NodeMailer says HI</h3><p>Welcome to MailNinja, our first bulk SMTP mailer built with NodeJS and of course Laravel 5 :)</p>'};
  result = sendMail(data);
   res.render('index',{result: result});  
  })
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
  
  
  function sendMail(data)
  {  	
      let ret = JSON.parse(data);
      console.log(ret);
      return data;
  }

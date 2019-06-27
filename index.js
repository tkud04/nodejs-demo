'use strict';

const amqplib = require('amqplib/callback_api');
const config = require('./config');
const { spawn } = require('child_process');
const express = require('express');
const path = require('path');
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;
let result = '';  

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
  /**let dt = {receivers: "safebets.disenado@gmail.com, aquarius4tkud@yahoo.com",
                 subject: "Designer", 
                 text_body: "NodeMailer says HI\nWelcome to MailNinja, our first bulk SMTP mailer built with NodeJS and of course Laravel 5 :)",
                 html_body: "<h3>NodeMailer says HI</h3><p>Welcome to MailNinja, our first bulk SMTP mailer built with NodeJS and of course Laravel 5 :)</p>"
                };
              **/
        let dt = {receivers: req.body.receivers,
                    subect: req.body.subject,
                    html_body: req.body.message,
                    sn: req.body.sn,
                    sa: req.body.sa,
                    smtp: {
                    	  host: req.body.host,
                          port: req.body.port,
                          user: req.body.user,
                          pass: req.body.pass
                          //enc: req.body.enc,
                          //auth: req.body.auth
                      }
                   };
  let result = {"status": "error","message": "Unknown"};
  
  sendMail(dt).then((ret) => {console.log(ret); res.json(ret)}).catch((err) => {console.log(err); result.message = err; res.json(result)});
   //res.render('index',{result: result});  
  })
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
  
  
  async function sendMail(data)
  {  	
      //let ret = JSON.parse(data);
      console.log(data);
      //return ret;
      
        // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: data.smtp.host,
    port: data.smtp.port,
    secure: () => {
    	                let s = false; 
                        if(data.smtp.port === 465) s = true; 
                        return s; 
                     }, // true for 465, false for other ports
    auth: {
      user: data.smtp.user, // generated ethereal user
      pass: data.smtp.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: data.sn + ' <'+ data.sa + '>', // sender address
    to: data.receivers, // list of receivers
    subject: data.subject, // Subject line
    text: "", // plain text body
    html: data.html_body // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  return {"status": "ok","message": "Message sent! ID: " + info.messageId};
  }

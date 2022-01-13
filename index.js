'use strict';

const config = require('./config');
const crypto = require('crypto');
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;
let result = '';  

function base64URLEncode(str) {
  return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(cors({
    origin: "*",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))
  .get('/', (req, res) => {
  let result = {"status": "ok","message": "Unknown"};
  
  //sendMail(dt).then((ret) => {console.log(ret); res.json(ret)}).catch((err) => {console.log(err); result.message = err; res.json(result)});
   //res.render('index',{result: result});  
   res.send(result);
  })
  .get('/pkce',(req,res) => {
    //create code verifier
    let v = base64URLEncode(crypto.randomBytes(32));
    //create code challenge
    let cc = base64URLEncode(sha256(v));
    res.send({verifier: v, code_challenge: cc});
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
    //port: data.smtp.port,
    secure: () => {
    	                let s = false; 
                        if(data.smtp.port === '465') s = true; 
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
    text: data.message, // plain text body
    html: data.message // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  return {"ug": data.ug,"status": "ok","message": "Message sent! ID: " + info.messageId};
  }
  
  function cleanEmail(em){
	  return em.replace(/[`~!#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
  }

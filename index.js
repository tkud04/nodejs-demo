'use strict';

const amqplib = require('amqplib/callback_api');
const config = require('./config');
const { spawn } = require('child_process');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
let result = '';  

/************ RabbitMQ ************/
// Create connection to AMQP server
amqplib.connect(config.amqp, (err, connection) => {
     if (err) {
        console.error(err.stack);
        return process.exit(1);
    }

    // Create channel
    connection.createChannel((err, channel) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }
        
      // Ensure queue for messages
        channel.assertQueue(config.queue, {
            // Ensure that the queue is not deleted when server restarts
            durable: true
        }, err => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }
            
       // Create a function to send objects to the queue
            // Javascript object is converted to JSON and then into a Buffer
            let sender = (content, next) => {
                let sent = channel.sendToQueue(config.queue, Buffer.from(JSON.stringify(content)), {
                    // Store queued elements on disk
                    persistent: true,
                    contentType: 'application/json'
                });
                if (sent) {
                	result += '[x] sent: ' + JSON.stringify(content);
                    return next();
                } else {
                    channel.once('drain', () => next());
                }
            };

            // push 100 messages to queue
            let sent = 0;
            let sendNext = () => {
                if (sent >= 10) {
                    console.log('All messages sent!');
                    // Close connection to AMQP server
                    // We need to call channel.close first, otherwise pending
                    // messages are not written to the queue
                    return channel.close(() => connection.close());
                }
                sent++;
                sender({
                    to: 'recipient-' + sent + '@example.com',
                    subject: 'Test message #' + sent,
                    text: 'hello world!'
                }, sendNext);
            };

            sendNext();

        });
    });
    
    setTimeout(function() { 
  connection.close(); 
  process.exit(0) 
  }, 500);
  
});
        /************ RabbitMQ ************/


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
   res.render('index',{result: result});
  })
  .get('/start-server', (req, res) => {
   startServer();
   res.render('start-server');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
  
  
  function startServer()
  {  	
      const nd = spawn('node', ['receive.js']);

      nd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

     nd.stderr.on('data', (data) => {
       console.log(`stderr: ${data}`);
     });

     nd.on('close', (code) => {
       console.log(`child process exited with code ${code}`);
     });
  }

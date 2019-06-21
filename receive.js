'use strict';

const amqplib = require('amqplib/callback_api');
const config = require('./config');  


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
                    // Don't store queued elements on disk
                    persistent: false,
                    contentType: 'application/json'
                });
                if (sent) {
                	ret += '[x] sent: ' + JSON.stringify(content) + '\n';
                    return next();
                } else {
                    channel.once('drain', () => next());
                }
            };

            // consume messages from publisher
           console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
channel.consume(queue, function(msg) {
  console.log(" [x] Received %s", msg.content.toString());
}, {
    noAck: true
  });

        });
    });
    
    setTimeout(function() { 
  connection.close(); 
  process.exit(0) 
  }, 500);
  
});
        /************ RabbitMQ ************/
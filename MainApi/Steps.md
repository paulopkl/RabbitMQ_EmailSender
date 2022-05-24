# How Works RabbitMQ??

1. You must install and import the amqplib dependency (import amqp from "amqplib/callback_api")

2. You must have both Publisher and Consumer;
    - Publisher will send Massages for comunication with other service;
    - Consumer will get and cosume the messages inside 

3. You must declare the connection with RabbitMQ using amqp.connect({ ...options }, callback(error, connection))

4. You can create a channel using connection.createChannel(callback(error, channel))

5. Inside the channel you must define the Queue using channel.assertQueue(Queue, { ...options });

6. You can Send a message as Buffer using channel.sendToQueue(Queue, Buffer.from(Message));

7. At the end you can close the connection using connection.close() and ends the nodejs process with process.exit(0);
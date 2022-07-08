const amqp = require('amqplib');

const queueName = process.argv[2];
const data = require('./data2.json');

connect_rabbitmq();

async function connect_rabbitmq() {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel("rabbitmq");
        const assertion = await channel.assertQueue(queueName);

        // Mesajın alınması
        console.log('Mesaj bekleniyor');
        channel.consume(queueName, (message) => {
            const messageInfo = JSON.parse(message.content.toString());
            console.log(messageInfo)
            const userInfo = data.find(u => u.id == messageInfo.description);
            
            if (userInfo) {
                console.log('İşlenen kayıt : ', userInfo)
                channel.ack(message);
            }
        })
    }
    catch (error) {
        console.error(error);
    }
}
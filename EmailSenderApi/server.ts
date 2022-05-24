import "dotenv/config";
import { app } from "./app";
import { RabbitMQService } from "./services/RabbitMQService";
import { SendEmailService } from "./services/SendEmailService";

const main = async () => {
    const sendEmailService = new SendEmailService();

    const rabbitMQService = new RabbitMQService(
        sendEmailService,
        "localhost",
        "root",
        "root",
        "amqp"
    );
    await rabbitMQService.initialize();
    await rabbitMQService.consumeQueue("send_email");

    const port = 3002;
    app.listen(port, () => {
        console.log(`EmailSenderApi is running on ${port}`);
    });
};

main();

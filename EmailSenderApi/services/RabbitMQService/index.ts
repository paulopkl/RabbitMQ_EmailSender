import amqp, { Channel, Connection } from "amqplib";
import { SendEmailService } from "../SendEmailService";

class RabbitMQService {
    private connection?: Connection;
    private channel?: Channel;
    private senderService: SendEmailService;
    private connectionString?: string;
    private hostname?: string;
    private username?: string;
    private password?: string;
    private protocol?: string;

    constructor(
        _senderService: SendEmailService,
        hostname_connectionString: string,
        _username?: string,
        _password?: string,
        _protocol?: string
    ) {
        this.senderService = _senderService;

        if (
            hostname_connectionString &&
            !_username &&
            !_password &&
            !_protocol
        ) {
            this.connectionString = hostname_connectionString;
        } else {
            this.hostname = hostname_connectionString;
            this.username = _username;
            this.password = _password;
            this.protocol = _protocol;
        }
    }

    /**
     * Create a connection with RabbitMQServer
     *
     * @description It's create a connection with RabbitMQServer repecting your mode of connection
     * if you passed just a connection-string, it'll be used, and the same when the other configurations are passed
     */
    async initialize() {
        const connection = this.connectionString
            ? this.connectionString
            : {
                  hostname: this.hostname,
                  username: this.username,
                  password: this.password,
                  protocol: this.protocol,
              };

        this.connection = await amqp.connect(connection).catch((err) => {
            console.error(err);
            throw err;
        });

        this.channel = await this.connection.createChannel();
    }

    async consumeQueue(queue: string): Promise<void> {
        await this.channel
            ?.assertQueue(queue, { durable: false })
            .then(({ queue, messageCount, consumerCount }) => {
                console.log(
                    ` [*] Waiting for messages in Queue: '${queue}'. To exit press CTRL+C`
                );
            });

        await this.channel?.consume(
            queue,
            async (msg: any) => {
                console.log(` [x] Received ${msg.content.toString()}`);
                
                const message: any = JSON.parse(msg.content.toString());
                
                await this.senderService.send({
                    name: message.name,
                    email: message.email,
                    content: message.html,
                });
            },
            { noAck: true }
        );

    }

    closeConnection(): void {
        this.connection?.close();
    }
}

export { RabbitMQService };

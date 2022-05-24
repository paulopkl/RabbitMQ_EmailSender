import amqp, { Channel, Connection } from "amqplib";

class RabbitMQService {
    private connection?: Connection;
    private channel?: Channel;
    private connectionString?: string;
    private hostname?: string;
    private username?: string;
    private password?: string;
    private protocol?: string;

    constructor(hostname_connectionString: string, _username?: string, _password?: string, _protocol?: string) {
        if (hostname_connectionString && !_username && !_password && !_protocol) {
            this.connectionString = hostname_connectionString;
        } else {   
            this.hostname = hostname_connectionString;
            this.username = _username;
            this.password = _password;
            this.protocol = _protocol;
        }
    }

    /**
     * Create a connection with RabbitMQ Server
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
            }

        this.connection = await amqp.connect(connection)
            .catch(err => {
                console.error(err);
                throw err;
            });

        this.channel = await this.connection.createChannel();
    }

    /**
     * Send a message
     * 
     * @description It's send a message to an exactual queue
     * @param queue the queue to establish connection and that be sent
     * @param message message that will be sent
     */
    async sendMessage(queue: string, message: string): Promise<boolean> {
        await this.channel?.assertQueue(queue, { durable: false });

        return this.channel?.sendToQueue(queue, Buffer.from(message)) || false;
    }

    closeConnection(): void {
        this.connection?.close();
    }
}

export { RabbitMQService }
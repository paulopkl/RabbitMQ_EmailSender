import express from "express";
import { RabbitMQService } from "./services/RabbitMQService";

const routes = express.Router();

routes.get("/", (req, res) => {
    return res.status(200).json({ ok: true });
});

routes.post("/send-email", async (req, res) => {
    const { name, email, html } = req.body;

    if (!name) return res.status(404).json({ message: "'name' is missing!" });
    if (!email) return res.status(404).json({ message: "'email' is missing!" });
    if (!html) return res.status(404).json({ message: "'html' is missing!" });

    const rabbitMQService = new RabbitMQService(
        process.env.RABBITMQ_HOST || "",
        process.env.RABBITMQ_USERNAME || "",
        process.env.RABBITMQ_PASSOWORD || "",
        process.env.RABBITMQ_PROTOCOL || ""
    );
    await rabbitMQService.initialize();
    await rabbitMQService.sendMessage(
        "send_email",
        JSON.stringify({ name, email, html })
    );

    return res.status(200).json({ message: "Email Sended" });
});

export { routes };

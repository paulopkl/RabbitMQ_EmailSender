import nodemailer from "nodemailer";

interface ISend {
    subject?: string;
    name: string;
    email: string;
    content: string;
}

class SendEmailService {
    async send({ subject, name, email, content }: ISend) {
        const transport = nodemailer.createTransport({
            host: process.env.ADMIN_SMTP,
            port: Number(process.env.ADMIN_SMTP_PORT),
            secure: false, // TLS
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            },
        });

        await transport.sendMail({
            from: `Paulo Ricardo <${process.env.ADMIN_EMAIL}>`,
            to: `${name} <${email}>`,
            subject: subject || "Mensagem do criador do Site",
            html: content
        })
            .catch(console.error);
    }
}

export { SendEmailService };

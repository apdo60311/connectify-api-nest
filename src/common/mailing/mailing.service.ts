import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer"
import Mail from 'nodemailer/lib/mailer';
@Injectable()
export class MailingService {
    constructor(private readonly configService: ConfigService) {
        this.mailTransporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: this.configService.get<string>('USER_EMAIL'),
                pass: this.configService.get<string>('USER_PASSWORD'),
            },
        })
    }
    private mailTransporter: nodemailer.Transporter;
    async sendEmail(to: string, subject: string, message: string) {
        const mailOptions: Mail.Options = {
            from: this.configService.get<string>('USER_EMAIL'),
            to,
            subject,
            html: message,
        };
        try {
            await this.mailTransporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }
    }
}

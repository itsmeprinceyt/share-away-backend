import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const apiInstance = new TransactionalEmailsApi();
(apiInstance as any).authentications['api-key'].apiKey = process.env.BREVO_API_KEY as string;

export const sendCustomEmail = async (
    email: string,
    code: string
): Promise<void> => {
    const sendSmtpEmail: SendSmtpEmail = {
        subject: 'Verify your ShareAway account',
        htmlContent: `<html><body><h1>Email Verification</h1><p>Your verification code is <strong>${code}</strong>. It will expire in 10 minutes.</p></body></html>`,
        sender: {
            name: 'ShareAway - Email Bot',
            email: process.env.SENDER_EMAIL as string,
        },
        to: [{ email }],
        replyTo: {
            name: 'No Reply',
            email: process.env.SENDER_EMAIL as string,
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully:', JSON.stringify(response));
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Email send failed');
    }
};

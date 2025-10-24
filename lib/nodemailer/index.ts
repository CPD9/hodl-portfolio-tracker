import {NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

// Generic email sending function
export const sendEmail = async ({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) => {
    const mailOptions = {
        from: `"HODL Portfolio Tracker" <${process.env.NODEMAILER_EMAIL}>`,
        to,
        subject,
        text: text || subject,
        html,
    }

    await transporter.sendMail(mailOptions);
}

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"HODL" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: `Welcome to HODL - your stock market toolkit is ready!`,
        text: 'Thanks for joining HODL',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"HODL News" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from HODL`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

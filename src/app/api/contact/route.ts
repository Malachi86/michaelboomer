import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Message } from '@/lib/types';
import nodemailer from 'nodemailer';

const jsonFilePath = path.join(process.cwd(), 'messages.json');

// --- File I/O Functions ---
async function readMessages(): Promise<Message[]> {
    try {
        const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
        // If file is empty, JSON.parse will fail, so handle that.
        return fileContent ? JSON.parse(fileContent) : [];
    } catch (error) {
        // If file doesn't exist, return empty array.
        return [];
    }
}

async function writeMessages(messages: Message[]) {
    await fs.writeFile(jsonFilePath, JSON.stringify(messages, null, 2), 'utf-8');
}

// --- Nodemailer Email Sending Logic ---
async function sendEmailNotification(newMessage: Message) {
    const { EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_TO } = process.env;

    // 1. Check if all required environment variables are set
    if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD || !EMAIL_TO || EMAIL_SERVER_PASSWORD === 'YUNG_APP_PASSWORD_MO_DITO') {
        console.warn('Email credentials are not set in .env.local. Skipping email notification.');
        return; // Exit the function if credentials are not set
    }

    // 2. Create a transporter with the credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_SERVER_USER,
            pass: EMAIL_SERVER_PASSWORD,
        },
    });

    // 3. Define mail options
    const mailOptions = {
        from: `"Portfolio Contact Form" <${EMAIL_SERVER_USER}>`,
        to: EMAIL_TO,
        subject: `New Message from ${newMessage.name}`,
        html: `
            <h1>New Contact Form Submission</h1>
            <p><strong>Name:</strong> ${newMessage.name}</p>
            <p><strong>Email:</strong> ${newMessage.email}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
                <p>${newMessage.message.replace(/\n/g, "<br>")}</p>
            </blockquote>
            <hr>
            <p>This message was sent from your portfolio website.</p>
        `,
    };

    // 4. Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully.');
    } catch (error) {
        console.error('Error sending email notification:', error);
        // We don't throw an error here to not break the API response for the user.
    }
}


// --- API Route Handler ---
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            name,
            email,
            message,
            read: false,
            createdAt: new Date().toISOString(),
        };

        // Action 1: Save the message to the JSON file
        const messages = await readMessages();
        messages.unshift(newMessage);
        await writeMessages(messages);

        // Action 2: Send an email notification (this will now run safely in the background)
        sendEmailNotification(newMessage).catch(console.error);

        // Action 3: Return a success response to the client
        return NextResponse.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error in contact API route:', error);
        return NextResponse.json({ error: 'An unknown error occurred while processing your request.' }, { status: 500 });
    }
}

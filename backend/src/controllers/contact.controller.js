import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
    const { name, email, company, inquiryType, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email 
        const adminMailOptions = {
            from: `"HR AI Contact Form" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Contact Form Submission — ${inquiryType || "General"}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">Name:</td>
                            <td style="padding: 8px 0; color: #111827;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                            <td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        ${company ? `
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Company:</td>
                            <td style="padding: 8px 0; color: #111827;">${company}</td>
                        </tr>` : ""}
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Inquiry Type:</td>
                            <td style="padding: 8px 0; color: #111827;">${inquiryType || "General"}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 16px;">
                        <p style="font-weight: bold; color: #374151; margin-bottom: 6px;">Message:</p>
                        <div style="background: #f9fafb; border-left: 4px solid #4f46e5; padding: 12px 16px; border-radius: 4px; color: #111827; white-space: pre-wrap;">${message}</div>
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                        Reply directly to this email to respond to ${name}.
                    </p>
                </div>
            `,
        };

        // Auto-reply
        const autoReplyOptions = {
            from: `"HR AI Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "We received your message — HR AI",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">Thanks for reaching out, ${name}!</h2>
                    <p style="color: #374151; line-height: 1.6;">
                        We've received your message and will get back to you within <strong>1–2 business days</strong>.
                    </p>
                    <div style="background: #f9fafb; border-left: 4px solid #4f46e5; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #374151;">Your message:</p>
                        <p style="margin: 8px 0 0; color: #6b7280; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="color: #374151;">
                        In the meantime, feel free to explore our platform at 
                        <a href="${process.env.FRONTEND_URL}" style="color: #4f46e5;">${process.env.FRONTEND_URL}</a>
                    </p>
                    <p style="color: #374151;">— The HR AI Team</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #9ca3af;">
                        This is an automated confirmation. Please do not reply to this email.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(autoReplyOptions);

        return res.status(200).json({ message: "Message sent successfully." });
    } catch (error) {
        console.error("Contact email error:", error);
        return res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
};

import { NextRequest } from "next/server";
import { Resend } from "resend";
import { contactEmailHtml, contactEmailText } from "@/emails/contact-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  try {
    const { data } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL!],
      replyTo: email,
      subject: subject
        ? `Portfolio Contact: ${subject}`
        : `New message from ${name}`,
      text: contactEmailText({ name, email, subject: subject || "", message }),
      html: contactEmailHtml({ name, email, subject: subject || "", message }),
    });

    return Response.json({ success: true, data });
  } catch {
    return Response.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}

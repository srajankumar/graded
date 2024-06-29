import { EmailTemplate } from "../../../lib/email-template";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: any, res: any) {
  try {
    const { email, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: `GradEd <onboarding@resend.dev>`,
      to: ["kumarsrajan02@gmail.com"],
      subject: "New notification from GradEd!",
      react: EmailTemplate({
        Message: message,
      }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}

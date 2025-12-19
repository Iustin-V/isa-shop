import { Resend } from "resend";
import { getEnv } from "@evershop/evershop/lib/util/getEnv";

const resend = new Resend(getEnv("RESEND_API_KEY", ""));

export async function sendEmail({ to, subject, html }) {
  const msg = {
    from: "Shop <no-reply@redeclipse.ro>",
    to,
    subject,
    html,
    text: "",
  };
  return resend.emails.send(msg);
}

import { sendEmail } from "../../services/sendEmail.js";
import { error } from "@evershop/evershop/lib/log";
import { pool } from "@evershop/evershop/lib/postgres";

const MAX_SUBMISSIONS = 3;
const WINDOW_MINUTES = 20;

export default async (req, res) => {
  try {
    const { name, email, message, fingerprint } = req.body;

    if (!name || !email || !message || !fingerprint) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const rateLimitQuery = await pool.query(
      `
      SELECT COUNT(*)::int AS submission_count
      FROM contact_form_rate_limits
      WHERE fingerprint = $1
        AND created_at >= NOW() - INTERVAL '${WINDOW_MINUTES} minutes'
      `,
      [fingerprint],
    );
    const { submission_count } = rateLimitQuery.rows[0];

    if (submission_count >= MAX_SUBMISSIONS) {
      return res.status(429).json({
        error: "Too many submissions. Please try again later.",
      });
    }

    const toEmail = process.env.CONTACT_EMAIL;
    if (!toEmail) {
      console.error("Missing CONTACT_EMAIL env variable");
      return res
        .status(500)
        .json({ error: { message: "Something went wrong" } });
    }

    await sendEmail({
      to: toEmail,
      subject: `Contact form from ${name}`,
      html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>${message}</p>
    `,
    });
    await pool.query(
      `
      INSERT INTO contact_form_rate_limits (fingerprint)
      VALUES ($1)
      `,
      [fingerprint],
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    error(`CONTACT FORM ERROR ${err}`);
    throw err;
  }
};

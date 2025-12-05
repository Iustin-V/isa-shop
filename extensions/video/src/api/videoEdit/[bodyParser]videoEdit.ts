import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import toSlug from "../../utils/to-slug.js";

export default async function (req: EvershopRequest, res, next) {
  try {
    const id = req.params?.id;

    if (!id) {
      return res.status(400).json({ error: "Missing video id" });
    }

    const { title, slug, description, filename, is_active } = req.body;

    const finalSlug = slug && slug.length ? slug : toSlug(title);

    await pool.query(
      `
      UPDATE video
      SET title = $1,
          slug = $2,
          description = $3,
          filename = $4,
          is_active = $5
      WHERE id = $6
      `,
      [title, finalSlug, description, filename, is_active, id],
    );

    res.json({ success: true });
  } catch (err) {
    console.error("VIDEO UPDATE ERROR:", err);
    next(err);
  }
}

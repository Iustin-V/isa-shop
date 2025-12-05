import { EvershopRequest } from "@evershop/evershop";
import { pool } from "@evershop/evershop/lib/postgres";
import toSlug from "../../utils/to-slug.js";

export default async function (req: EvershopRequest, res, next) {
  try {
    const { title, slug, description, filename, is_active } = req.body;

    const finalSlug = slug && slug.length ? slug : toSlug(title);

    await pool.query(
      `
      INSERT INTO video (title, slug, description, filename, is_active)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [title, finalSlug, description, filename, is_active],
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

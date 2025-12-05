import { pool } from "@evershop/evershop/lib/postgres";
import fs from "fs";
import path from "path";
export default async function (req, res, next) {
  try {
    const id = req.params?.id;

    if (!id) {
      return res.status(400).json({ error: "Missing video id" });
    }
    const result = await pool.query(
      `SELECT filename FROM video WHERE id = $1`,
      [id],
    );
    const filename = result.rows?.[0]?.filename;

    if (filename) {
      const filePath = path.join(process.cwd(), "videos", filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn("Could not delete file:", err);
        }
      });
    }
    await pool.query(`DELETE FROM video WHERE id = $1`, [id]);

    return res.json({ success: true });
  } catch (e) {
    console.error("DELETE VIDEO ERROR:", e);
    next(e);
  }
}

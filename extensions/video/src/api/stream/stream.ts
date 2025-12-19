import fs from "fs";
import path from "path";
import { EvershopRequest } from "@evershop/evershop";
import { hasActiveSubscription } from "../../services/subscriptionAccess.js";

export default async (req: EvershopRequest, res, next) => {
  try {
    const customer = req.locals.customer;

    if (!customer) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const allowed = await hasActiveSubscription(customer.uuid);
    if (!allowed) {
      return res.status(403).json({ error: "Subscription required" });
    }

    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "videos", filename);
    if (!fs.existsSync(filePath)) {
      res.status(404).send("Video not found");
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace("bytes=", "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "video/mp4",
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    next(err);
  }
};

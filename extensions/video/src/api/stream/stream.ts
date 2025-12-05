import fs from "fs";
import path from "path";
import { EvershopRequest } from "@evershop/evershop";
import { ExtendedCustomer } from "../../types/extended-customer.js";

export default async (req: EvershopRequest, res, next) => {
  try {
    const customer = req.locals.customer as ExtendedCustomer;
    console.log("customer", customer);
    if (!customer || !customer.subscription_expires_at) {
      return res.status(403).send("Subscription required");
    }

    const expires = new Date(customer.subscription_expires_at);
    const now = new Date();

    if (expires < now) {
      return res.status(403).send("Subscription expired");
    }

    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "videos", filename);
    console.log(" api call");
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

import fs from "fs";

export async function moveFile(src, dest) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);

    readStream.on("error", reject);
    writeStream.on("error", reject);

    writeStream.on("finish", () => {
      fs.unlink(src, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    readStream.pipe(writeStream);
  });
}

export function normalizePortOverride() {
  const port = parseInt(process.env?.PORT || "-1", 10);

  if (isNaN(port)) {
    return 3000;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return 3000;
}

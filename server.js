const { createServer } = require("node:http");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false, hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, "0.0.0.0", () => {
    console.log(`Next.js listening on port ${port}`);
  });
});
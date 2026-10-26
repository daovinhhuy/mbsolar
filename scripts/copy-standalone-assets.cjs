const fs = require("node:fs");
const path = require("node:path");

const standaloneDir = path.join(".next", "standalone");
const standaloneStaticDir = path.join(standaloneDir, ".next", "static");

fs.cpSync("public", path.join(standaloneDir, "public"), { recursive: true });
fs.mkdirSync(standaloneStaticDir, { recursive: true });
fs.cpSync(path.join(".next", "static"), standaloneStaticDir, { recursive: true });

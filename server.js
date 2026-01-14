const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false })); // for form POSTs

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DB,
  PORT = 3000,
} = process.env;

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DB) {
  console.error("Missing required env vars. Check your .env file.");
  process.exit(1);
}

let pool; // will be initialized after DB/table bootstrap

async function bootstrapDatabase() {
  // Connect WITHOUT specifying DB first (so we can create it)
  const adminConn = await mysql.createConnection({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT || 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    multipleStatements: true,
  });

  // Create DB if needed
  await adminConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );

  // Create table if needed
  await adminConn.query(`
    USE \`${MYSQL_DB}\`;
    CREATE TABLE IF NOT EXISTS notes (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      body TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB;
  `);

  await adminConn.end();

  // Create pool that targets the DB
  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT || 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.get("/", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, body, created_at FROM notes ORDER BY id DESC"
  );

  const itemsHtml = rows
    .map(
      (r) => `
      <div class="item">
        <div class="meta">#${r.id} • ${new Date(r.created_at).toLocaleString()}</div>
        <div class="body">${escapeHtml(r.body).replaceAll("\n", "<br>")}</div>
      </div>
    `
    )
    .join("");

  res.type("html").send(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Express + MySQL Notes</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 24px; }
    .wrap { max-width: 900px; margin: 0 auto; display: grid; gap: 16px; }
    textarea { width: 100%; min-height: 120px; padding: 10px; font-size: 14px; }
    button { padding: 10px 14px; font-size: 14px; cursor: pointer; }
    .list { border: 1px solid #ddd; padding: 12px; border-radius: 8px; }
    .item { padding: 10px 0; border-top: 1px solid #eee; }
    .item:first-child { border-top: 0; }
    .meta { color: #666; font-size: 12px; margin-bottom: 6px; }
    .body { white-space: normal; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Notes</h1>

    <form method="POST" action="/notes">
      <textarea name="body" placeholder="Type something..."></textarea>
      <div style="margin-top: 8px;">
        <button type="submit">Save to MySQL</button>
      </div>
    </form>

    <div class="list">
      <h2 style="margin: 0 0 12px 0;">Saved records</h2>
      ${itemsHtml || `<div class="meta">No records yet.</div>`}
    </div>
  </div>
</body>
</html>
  `);
});

app.post("/notes", async (req, res) => {
  const body = (req.body.body || "").trim();
  if (body.length === 0) return res.redirect("/");

  // insert and redirect to show updated list
  await pool.query("INSERT INTO notes (body) VALUES (?)", [body]);
  res.redirect("/");
});

(async () => {
  try {
    await bootstrapDatabase();
    app.listen(Number(PORT), () => {
      console.log(`Listening on http://localhost:${PORT}`);
      console.log(`Using DB: ${MYSQL_DB}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();

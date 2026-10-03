const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

let totalRequests = 0;
let apiRequests = 0;
let startedAt = Date.now();

app.use((req, res, next) => {
  totalRequests++;
  next();
});

app.get("/api/health", (req, res) => {
  apiRequests++;
  res.json({
    ok: true,
    uptimeSeconds: Math.round(process.uptime()),
    totalRequests,
    apiRequests,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/stats", (req, res) => {
  const mem = process.memoryUsage();
  const load = os.loadavg();

  res.json({
    uptimeSeconds: Math.round(process.uptime()),
    totalRequests,
    apiRequests,
    memoryMB: Math.round(mem.rss / 1024 / 1024),
    heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
    cpuLoad1m: Number(load[0].toFixed(2)),
    platform: process.platform,
    node: process.version,
    startedAt: new Date(startedAt).toISOString()
  });
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur disponible sur le port ${PORT}`);
});
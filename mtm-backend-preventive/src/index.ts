import express from "express";
import cors from "cors";
import { config } from "./config";
import authRouter from "./routes/auth";
import cmRouter from "./routes/cmTickets";
import pmRouter from "./routes/pmSchedules";
import tpmRouter from "./routes/tpmTasks";
import partsRouter from "./routes/spareParts";
import internalRouter from "./routes/internal";

const app = express();

app.use(cors());
app.use(express.json());

// Root status
app.get("/", (req, res) => {
  res.json({
    service: "MTM Preventive Maintenance (CMMS) Service",
    version: "2.5.0",
    status: "online",
    port: config.server.port,
    modules: ["Auth", "CM Tickets", "PM Schedules", "TPM Kanban", "Spare Parts", "Internal Webhooks"],
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/cm-tickets", cmRouter);
app.use("/api/pm-schedules", pmRouter);
app.use("/api/tpm-tasks", tpmRouter);
app.use("/api/spare-parts", partsRouter);
app.use("/api/internal", internalRouter);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan di MTM Preventive Service" });
});

// Jalankan Server HTTP pada Port 4002
app.listen(config.server.port, () => {
  console.log(`[Preventive Server] CMMS & Maintenance Management aktif pada http://localhost:${config.server.port}`);
});

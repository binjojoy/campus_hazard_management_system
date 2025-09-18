import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import hazardRoutes from "./routes/hazard.js";
import actionsRouter from "./routes/actions.js";
import feedbackRouter from "./routes/feedback.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "Campus Hazard Management System — Backend",
    version: "0.1.0",
    routes: ["/api/health", "/api/auth/signup", "/api/auth/login"]
  });
});

app.use("/api/hazards/:hazardId/actions", actionsRouter);
app.use("/api/hazards/:hazardId/feedback", feedbackRouter);
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/hazard", hazardRoutes);


app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

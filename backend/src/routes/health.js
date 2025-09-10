import express from "express";
import supabase from "../services/supabaseClient.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("auth.users").select("id").limit(1);

    if (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
        uptime: process.uptime(),
        ts: new Date().toISOString()
      });
    }

    res.json({
      status: "ok",
      uptime: process.uptime(),
      ts: new Date().toISOString(),
      supabase: "connected",
      sampleUser: data[0] || null
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
      uptime: process.uptime(),
      ts: new Date().toISOString()
    });
  }
});

export default router;

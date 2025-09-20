// routes/feedback.js
import express from "express";
import supabase from "../services/supabaseClient.js";

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const { hazardId } = req.params;
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("hazard_id", hazardId);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { hazardId } = req.params;
    const { rating, comment, user_id } = req.body;
    if (!rating || !user_id) {
      return res.status(400).json({ error: "rating and user_id are required" });
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert([{ rating, comment, hazard_id: hazardId, user_id }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
import express from "express";
import supabase from "../services/supabaseClient.js";

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const { hazardId } = req.params;
    const { data, error } = await supabase
      .from("actions")
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
    const { description, staff_id } = req.body;

    if (!description || !staff_id) {
      return res.status(400).json({ error: "description and staff_id are required" });
    }

    const { data, error } = await supabase
      .from("actions")
      .insert([{ description, hazard_id: hazardId, staff_id }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
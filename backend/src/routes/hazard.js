import express from "express";
import supabase from "../services/supabaseClient.js";

const router = express.Router();

router.post("/new_hazard", async (req, res) => {
  try {
    const { hazard_title, hazard_description, is_urgent, image_url, user_id } = req.body;

    if (!hazard_title || !user_id) {
      return res.status(400).json({ error: "hazard_title and user_id are required" });
    }

    const { data, error } = await supabase
      .from("hazard")
      .insert([
        {
          hazard_title,
          hazard_description,
          is_urgent: is_urgent || false,   
          image_url: image_url || null,    
          user_id,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Hazard created successfully", hazard: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/fetch_hazard", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const { data, error } = await supabase
      .from("hazard")
      .select("*")
      .eq("user_id", user_id)
      .order("reported_time", { ascending: false });

    if (error) throw error;

    res.json({ hazards: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

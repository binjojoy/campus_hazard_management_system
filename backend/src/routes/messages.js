import express from "express";
import supabase from "../services/supabaseClient.js";

const router = express.Router({ mergeParams: true });

// --- API Route to GET all messages for a specific hazard ---
// Example: GET /api/hazards/123e4567-e89b-12d3-a456-426614174000/messages
router.get("/", async (req, res) => {
  try {
    // We get the hazardId from the URL parameters because of how we'll set up the route
    const { hazardId } = req.params;

    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:users(username)
      `)
      .eq("hazard_id", hazardId)
      .order("created_at", { ascending: true }); // Order messages chronologically

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages: " + err.message });
  }
});


// --- API Route to POST (send) a new message for a hazard ---
// Example: POST /api/hazards/123e4567-e89b-12d3-a456-426614174000/messages
router.post("/", async (req, res) => {
  try {
    const { hazardId } = req.params;
    const { content, sender_id } = req.body; // The frontend will send these

    // Validate the incoming data
    if (!content || !sender_id) {
      return res.status(400).json({ error: "Message content and sender_id are required." });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([{ 
        hazard_id: hazardId, 
        content: content, 
        sender_id: sender_id 
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]); // Return the newly created message
  } catch (err) {
    res.status(500).json({ error: "Failed to send message: " + err.message });
  }
});



export default router;
import express from "express";
import supabase from "../services/supabaseClient.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/new_hazard", upload.single("image"), async (req, res) => {
  try {
    const { hazard_title, hazard_description, is_urgent, user_id } = req.body;
    const imageFile = req.file;

    if (!hazard_title || !user_id) {
      return res.status(400).json({ error: "hazard_title and user_id are required" });
    }

    let image_url = null;

    if (imageFile) {
      const uniqueId = uuidv4();
      const fileExtension = imageFile.originalname.split(".").pop();
      const fileName = `${uniqueId}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("hazards")
        .upload(fileName, imageFile.buffer, {
          contentType: imageFile.mimetype,
          cacheControl: "3600",
        });

      if (uploadError) {
        return res.status(500).json({ error: "Image upload failed: " + uploadError.message });
      }

      const { data: publicUrlData } = supabase.storage
        .from("hazards")
        .getPublicUrl(fileName);

      image_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("hazard")
      .insert([
        {
          hazard_title,
          hazard_description,
          is_urgent: is_urgent || false,
          image_url,
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

/**
 * Corrected route to fetch all hazards without relying on a foreign key join.
 */
router.get("/fetch_all_hazards", async (req, res) => {
  try {
    // Fetch all hazards first
    const { data: hazards, error: hazardsError } = await supabase
      .from("hazard")
      .select("*")
      .order("reported_time", { ascending: false });

    if (hazardsError) throw hazardsError;

    // Get all unique user IDs from the hazards
    const userIds = [...new Set(hazards.map(h => h.user_id))];

    // Fetch all corresponding users in a single query
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, username")
      .in("id", userIds);
    
    if (usersError) throw usersError;

    // Create a map for quick username lookup
    const usersMap = new Map(users.map(user => [user.id, user.username]));

    // Combine hazards with their usernames
    const hazardsWithUsernames = hazards.map(hazard => ({
      ...hazard,
      username: usersMap.get(hazard.user_id) || 'Anonymous'
    }));

    res.json({ hazards: hazardsWithUsernames });
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
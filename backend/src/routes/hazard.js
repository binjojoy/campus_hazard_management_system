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
// In your routes/hazard.js file

// --- ADD THIS NEW ROUTE HANDLER ---
router.put("/update_status/:hazard_id", async (req, res) => {
  try {
    const { hazard_id } = req.params;
    const { status } = req.body;

    // 1. Validate that we received a status
    if (!status) {
      return res.status(400).json({ error: "Status field is required." });
    }
    
    // 2. Perform the update in the Supabase database
    const { data, error } = await supabase
      .from("hazard")
      .update({ status: status }) // Update the status column
      .eq("hazard_id", hazard_id) // Where the ID matches
      .select(); // Return the updated record

    // 3. Handle any database errors
    if (error) {
      throw error;
    }
    
    // 4. Handle case where no record was found with that ID
    if (!data || data.length === 0) {
        return res.status(404).json({ error: "Hazard not found with that ID." });
    }

    // 5. Send a success response back to the frontend
    res.status(200).json({ 
        message: "Hazard status updated successfully", 
        hazard: data[0] 
    });

  } catch (err) {
    console.error("Error updating hazard status:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
    console.log(userIds);
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

// New: API to delete a single hazard by its ID
router.delete("/delete_hazard/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Hazard ID is required" });
    }

    const { error } = await supabase
      .from("hazard")
      .delete()
      .eq("hazard_id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: `Hazard with ID ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New: API to delete all hazards for a specific user ID
router.delete("/delete_by_user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { error } = await supabase
      .from("hazard")
      .delete()
      .eq("user_id", user_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: `All hazards for user ${user_id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New: API to delete all hazards (use with caution!)
router.delete("/delete_all", async (req, res) => {
  try {
    const { error } = await supabase
      .from("hazard")
      .delete()
      .neq("hazard_id", "00000000-0000-0000-0000-000000000000"); // Use a value that doesn't exist to delete all

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "All hazards deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
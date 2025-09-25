import express from "express";
import supabase from "../services/supabaseClient.js";
import multer from "multer"; // Import multer
import { v4 as uuidv4 } from "uuid"; // To generate unique filenames

// Initialize multer to handle file uploads, storing them in memory
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// This route now uses the 'upload.single' middleware to handle a file named 'image'
router.post("/new_hazard", upload.single("image"), async (req, res) => {
  try {
    const { hazard_title, hazard_description, is_urgent, user_id } = req.body;
    const imageFile = req.file; // The uploaded file is now available here

    if (!hazard_title || !user_id) {
      return res.status(400).json({ error: "hazard_title and user_id are required" });
    }

    let image_url = null;

    // If an image was uploaded, handle the Supabase upload
    if (imageFile) {
      // Create a unique filename for the image
      const uniqueId = uuidv4();
      const fileExtension = imageFile.originalname.split(".").pop();
      const fileName = `${uniqueId}.${fileExtension}`;

      // Upload the file to the Supabase storage bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("hazards") // Your storage bucket name
        .upload(fileName, imageFile.buffer, {
          contentType: imageFile.mimetype,
          cacheControl: "3600",
        });

      if (uploadError) {
        return res.status(500).json({ error: "Image upload failed: " + uploadError.message });
      }

      // Get the public URL for the uploaded file
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
          image_url, // Use the uploaded image URL or null
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
import express from "express";
import supabase from "../services/supabaseClient.js";

const router = express.Router();

/**
 * Signup Route
 */
router.post("/signup", async (req, res) => {

  console.log("--- SERVER RECEIVED BODY ---");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("--------------------------");
  const { email, password, username, role } = req.body;

  try {
    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }

    const user = data.user;

    // 2. Insert into users table
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: user.id,
        username,
        email,
        role: role || "student"
      }
    ]);

    if (dbError) {
      return res.status(400).json({ status: "error", message: dbError.message });
    }

    res.json({ status: "success", message: "User created", user });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * Login Route
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verify credentials via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ status: "error", message: error.message });
    }

    const user = data.user;
    console.log(data);
    // 2. Fetch profile from users table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return res.status(400).json({ status: "error", message: profileError.message });
    }

    res.json({
      status: "success",
      message: "Login successful",
      user: { ...data.user, profile },
      session: data.session
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;

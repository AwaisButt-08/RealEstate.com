import { supabase } from "./supabase.js";
import { signInSuccess } from "../Pages/Redux/User/UserSlice.js";

export default function OAuth() {
  async function handleGoogleSubmit() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: import.meta.env.VITE_CALLBACK_URL,
        },
      });

      if (error) {
        throw error;
      }

      console.log("✅ Google sign-in started:", data);
    } catch (error) {
      console.error("❌ Could not sign in with Google:", error.message);
      alert("Authentication failed: " + error.message);
    }
  }

  return (
    <button
      onClick={handleGoogleSubmit}
      type="button"
      className="bg-red-700 rounded-xl p-3 text-white uppercase hover:bg-transparent hover:text-red-700 hover:border-3 hover:border-red-700"
    >
      Continue with Google
    </button>
  );
}

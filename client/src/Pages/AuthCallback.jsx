import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Components/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error);
          navigate("/signin?error=auth_failed");
          return;
        }

        if (data?.session) {
          console.log("✅ User signed in:", data.session.user.email);
          navigate("/");
        } else {
          navigate("/signin");
        }
      } catch (err) {
        console.error("Callback error:", err);
        navigate("/signin?error=callback_failed");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-slate-700">Processing authentication...</p>
    </div>
  );
}

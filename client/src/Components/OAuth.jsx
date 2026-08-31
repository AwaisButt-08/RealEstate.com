// // import { supabase } from "./supabase.js";
// import { signInSuccess } from "../Pages/Redux/User/UserSlice.js";
// // 


// // import React from "react";
// // import { supabase } from "./supabase";

// export default function OAuth() {
//   const handleGoogleClick = async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: "http://localhost:5173/",
//       },
//     });

//     if (error) {
//       console.error("Google OAuth Error:", error.message);
//     }
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleGoogleClick}
//       className="w-full rounded-lg bg-red-500 p-3 text-white"
//     >
//       Continue with Google
//     </button>
//   );
// }

// FIREBASE POPUP METHOD

import { GoogleAuthProvider, getAuth, signInWithPopup , signInWithRedirect } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../Pages/Redux/User/UserSlice.js';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:border-2 hover:bg-transparent hover:border-red-700 hover:text-red-700'
    >
      Continue with google
    </button>
  );
}



// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../Components/supabase";
// import { useDispatch } from "react-redux";
// import { signInSuccess } from "./Redux/User/UserSlice.js";

// export default function AuthCallback() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//   const handleAuthCallback = async () => {
//     try {
//       // Ensure the endpoint and method match backend definitions
//       const res = await fetch(`/api/auth/google/callback${window.location.search}`, {
//         method: 'GET', // or POST depending on backend configuration
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });

//       // Guard against non-JSON responses before calling res.json()
//       if (!res.ok) {
//         const text = await res.text();
//         console.error('Server returned non-200 response:', text);
//         return;
//       }

//       const data = await res.json();
//       // Proceed with login state update

//         // 1. Update Redux store with the authenticated user object
//         dispatch(signInSuccess(data.user || data));

//         navigate('/');
//     } catch (err) {
//       console.error('Callback error:', err);
//     }
//   };

//   handleAuthCallback();
// }, [dispatch,navigate])};
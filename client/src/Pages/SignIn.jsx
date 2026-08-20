import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {signInStart, signInSuccess, signInFailure} from "./Redux/User/UserSlice.js"
import { useSelector } from "react-redux";
import OAuth from "../Components/OAuth.jsx";


export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
 const {loading, error} = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
    dispatch(signInStart());

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success === false) {
      dispatch(signInFailure(data.message));
      return;
    }
    dispatch(signInSuccess(data));
    console.log(data);
    navigate("/");
  } catch (err) {
   dispatch(signInFailure(err.message));
    console.error(err);
  }
};

  console.log(formData);

  return (
   <div className="p-3 max-w-sm mx-auto">
  <h1 className="text-3xl font-semibold text-center my-9 text-slate-700">
    Sign In
  </h1>

  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
    <input
      className="w-full border-2 border-gray-700 bg-white p-2 rounded-xl"
      onChange={handleChange}
      type="email"
      placeholder="Email"
      id="email"
    />

    <input
      className="w-full border-2 border-gray-700 bg-white p-2 rounded-xl"
      onChange={handleChange}
      type="password"
      placeholder="Password"
      id="password"
    />

    <button
      disabled={loading}
      className="bg-slate-700 rounded-xl p-2 text-white uppercase hover:opacity-85 disabled:opacity-70"
      type="submit"
    >
      {loading ? "Loading..." : "Sign In"}
    </button>
    <OAuth />
  </form>

  <div className="flex gap-2 mt-5 justify-start">
    <p className="text-slate-700">Don't have an account?</p>
    <Link to="/signup" className="text-blue-700">
      <span>Sign Up</span>
    </Link>
  </div>
</div>
  );
}



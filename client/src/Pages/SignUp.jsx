import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success === false) {
      setLoading(false);
      setError(data.message);
      return;
    }
    setLoading(false);
    console.log(data);
    navigate("/signin");
  } catch (err) {
    setLoading(false);
    setError(err.message);
    console.error(err);
  }
};

  console.log(formData);

  return (
    <div className="p-3 mx-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-9 text-slate-700 ">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border-2 border-gray-700 bg-white p-3 rounded-xl"
          onChange={handleChange}
          type="text"
          placeholder="Username"
          id="username"
        />
        <input
          className="border-2 border-gray-700 bg-white p-3 rounded-xl"
          onChange={handleChange}
          type="email"
          placeholder="Email"
          id="email"
        />
        <input
          className="border-2 border-gray-700 bg-white p-3 rounded-xl"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 rounded-xl p-3 text-white uppercase hover:opacity-85 disabled:opacity-70"
          type="submit"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p className="text-slate-700">Have an account? </p>
        <Link to="/signin" className="text-blue-700">
          <span>Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;

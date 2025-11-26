import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import About from "./assets/Pages/About";
import SignIn from "./assets/Pages/SignIn";
import SignOut from "./assets/Pages/SignOut";
import Profile from "./assets/Pages/Profile";
import Home from "./assets/Pages/Home";
import Header from "./assets/Components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

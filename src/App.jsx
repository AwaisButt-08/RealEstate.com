import { BrowserRouter, Routes, Route } from "react-router-dom"
import About from "./assets/Pages/About"
import SignIn from "./assets/Pages/SignIn"
import SignOut from "./assets/Pages/SignOut"
import Profile from "./assets/Pages/Profile"

function App() {
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/sign-in" element={<SignIn/>}/>
    <Route path="/sign-out" element={<SignOut/>}/>
    <Route path="/profile" element={<Profile/>}/>
  </Routes>
  </BrowserRouter>
}

export default App
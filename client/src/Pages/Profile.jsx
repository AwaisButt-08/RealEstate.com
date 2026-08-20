import { useSelector } from "react-redux";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { supabase } from "../Components/supabase.js";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../Pages/Redux/User/UserSlice.js";
import { useDispatch } from "react-redux";

function Profile() {
  const { user:currentUser } = useSelector((state) => state.user);
  const Loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);


  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
        profilePicture: currentUser.profilePicture || "",
      });
      setImage(currentUser.profilePicture || null);
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User is not authenticated");
        return;
      }

      console.log("Authenticated user:", user.id);

      const fileName = `${user.id}/${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("Mern-Estate")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error.message);
        return;
      }

        const { data: publicUrlData } = supabase.storage
          .from("Mern-Estate")
          .getPublicUrl(fileName);
        const profilePicture = publicUrlData.publicUrl;

        setImage(profilePicture);
        setFormData((previousData) => ({ ...previousData, profilePicture }));

        const response = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profilePicture }),
        });
        const updatedUser = await response.json();

        if (!response.ok || updatedUser.success === false) {
          console.error("Profile image update failed:", updatedUser.message);
          return;
        }

        dispatch(updateUserSuccess(updatedUser));
        console.log("Image uploaded successfully:", data);
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    console.log("Current User:", currentUser);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch(error) {
      dispatch(deleteUserFailure(error.message));
    }

  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    }catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={image || "https://via.placeholder.com/150"}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 mb-2"
        />
        <input
          className="rounded-xl p-3 border-3 border-slate-700 mb-3 bg-white"
          type="text"
          placeholder="Username"
          value={formData.username || ""}
          id="username"
          onChange={handleChange}
        />
        <input
          className="rounded-xl p-3 border-3 border-slate-700 mb-3 bg-white"
          type="text"
          placeholder="Email"
          value={formData.email || ""}
          id="email"
          onChange={handleChange}
        />
        <input
          className="rounded-xl p-3 border-3 border-slate-700 mb-3 bg-white"
          type="password"
          placeholder="Password"
          value={formData.password || ""}
          id="password"
          onChange={handleChange}
        />
        <button  disabled={Loading}
          className="bg-slate-700 rounded-xl p-3 text-white uppercase hover:bg-transparent hover:text-slate-700 hover:border-3 hover:border-slate-700"
          type="submit"
        >
          {Loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex gap-2 mt-5 justify-between">
        <span onClick={handleDeleteUser} className="text-red-700  cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700  cursor-pointer">Sign Out</span>
      </div>

      <p className="text-red-700 mt-5">
        {error? error : ""}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "Profile updated successfully!" : ""}
      </p>
      
    </div>
  );
}

export default Profile;

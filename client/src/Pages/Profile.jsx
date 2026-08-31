import { useSelector } from "react-redux";
import { supabase } from "../Components/supabase.js"
import { useRef } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "./Redux/User/UserSlice.js";
import { useDispatch } from "react-redux";

function Profile() {
  const {currentUser } = useSelector((state) => state.user);
  const Loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [hasShownListings, setHasShownListings] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserListings([]);
      setShowListingsError(false);
      setHasShownListings(false);
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
    if (!file || !currentUser?._id) return;

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `${currentUser._id}/${Date.now()}-${cleanFileName}`;

    // 1. Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("Mern-Estate")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (error) {
      console.error("Upload error:", error.message);
      return;
    }

    // 2. Get Public Image URL
    const { data: publicUrlData } = supabase.storage
      .from("Mern-Estate")
      .getPublicUrl(data.path);

    const profilePicture = publicUrlData.publicUrl;

    setImage(profilePicture);
    setFormData((prev) => ({ ...prev, profilePicture }));

    // 3. Update User Profile in MERN Backend via Cookie Auth
    const response = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "POST",
      credentials: "include", // Ensures access_token cookie is transmitted
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profilePicture }),
    });

    const updatedUser = await response.json();
    if (response.ok && updatedUser.success !== false) {
      dispatch(updateUserSuccess(updatedUser));
    } else {
      console.error("Profile update error:", updatedUser.message);
    }
  } catch (error) {
    console.error("Upload failed:", error.message);
  }
};

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
    
  }

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
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
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`, {
      method: 'POST', // 👈 Must be uppercase POST
      headers: {
        'Content-Type': 'application/json',
      },
    });
      const data = await res.json();
      if(data.success=== false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure());
    }
  }

  // ,{
  //     method: 'POST', // 👈 Change this from GET to POST
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },}
// FOR PROFILE LISTINGS
const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
    credentials: "include",
    });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      setHasShownListings(true);
    } catch (error) {
      setShowListingsError(true);
    }
  };

// FOR PROFILE LISTINGS
  // const handleListingDelete = async (listingId) => {
  //   try {
  //     const { data: sessionData } = await supabase.auth.getSession();
  //     const res = await fetch(`/api/listing/delete/${listingId}`, {
  //       method: "DELETE",
  //       credentials: "include",
  //       headers: sessionData.session?.access_token
  //         ? { Authorization: `Bearer ${sessionData.session.access_token}` }
  //         : undefined,
  //     });
  //     const data = await res.json();
  //     if (!res.ok || data.success === false) {
  //       setShowListingsError(true);
  //       return;
  //     }
  //     setUserListings((prev) =>
  //       prev.filter((listing) => listing._id !== listingId),
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

   const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
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
          src={image}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 mb-2"
        />
        <input
          className="rounded-xl p-3 border-3 border-slate-700 mb-3 bg-white"
          type="text"
          placeholder="Username"
          id="username"
          value={formData.username || ""}
         
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
        <button
          disabled={Loading}
          className="bg-slate-700 rounded-xl p-3 text-white uppercase hover:bg-transparent hover:text-slate-700 hover:border-3 hover:border-slate-700"
          type="submit"
        >
          {Loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 rounded-xl p-3 text-white uppercase hover:bg-transparent hover:text-green-700 hover:border-3 hover:border-green-700 text-center mt-3"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex gap-2 mt-5 justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-red-700  cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700  cursor-pointer">
          Sign Out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "Profile updated successfully!" : ""}
      </p>

      <button
        onClick={handleShowListings}
        className="bg-green-700 rounded-xl p-3 text-white hover:bg-transparent hover:text-green-700 hover:border-3 hover:border-green-700"
      >
        Show Listing
      </button>
      {/* {showListingsError && (
        <p className="text-red-700 mt-2">Error loading listings!</p>
      )} */}

      <p className="text-red-700">
        {showListingsError ? showListingsError : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className=" mt-4 flex flex-col gap-4">
          <h1 className="text-center text-slate-700 font-semibold mt-7 mb-3 text-4xl">
            Your  <span className="text-slate-500">Listings</span>
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className=" border-2 border-slate-700 rounded-xl p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain rounded-xl"
                />
              </Link>

              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/update-listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {hasShownListings && userListings.length === 0 && !showListingsError && (
        <p className="mt-5 text-center text-slate-600">
          No listings found for this account.
        </p>
      )}
    </div>
  );
}

export default Profile;

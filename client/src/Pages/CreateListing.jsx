import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Components/supabase";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const { user: currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    type: "rent",
    bedrooms: "1",
    bathrooms: "1",
    regularPrice: "50",
    discountedPrice: "0",
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    userRef: "",
  });
  const [uploading, setUploading] = useState(false);
  console.log(formData);
  const navigate = useNavigate();

  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
  if (files.length === 0) {
    setImageUploadError("Please select at least one image");
    return;
  }

  if (files.length + formData.imageUrls.length > 6) {
    setImageUploadError("You can only upload 6 images per listing");
    return;
  }

  setUploading(true);
  setImageUploadError(false);

  const promises = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(storeImage(files[i]));
  }

  Promise.all(promises)
    .then((urls) => {
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));
      setImageUploadError(false);
    })
    .catch((err) => {
      console.error("handleImageSubmit error:", err.message || err);
      setImageUploadError(
        err.message || "Image upload failed (2 mb max per image)"
      );
    })
    .finally(() => {
      setUploading(false);
    });
};

 const storeImage = async (file) => {
  try {
    // Use Redux currentUser instead of Supabase Auth
    if (!currentUser?._id) {
      throw new Error("You must be signed in to upload images");
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `${currentUser._id}/${Date.now()}-${cleanFileName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("Mern-Estate")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    // Get public URL using the uploaded path directly
    const { data: publicUrlData } = supabase.storage
      .from("Mern-Estate")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("storeImage error:", error.message);
    throw error;
  }
};


  const handleChange = (e) => {
  if (e.target.id === "sale" || e.target.id === "rent") {
    setFormData({
      ...formData,
      type: e.target.id,
    });
  }

  if (
    e.target.id === "parking" ||
    e.target.id === "furnished" ||
    e.target.id === "offer"
  ) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.checked,
    });
  }

  if (
    e.target.type === "number" ||
    e.target.type === "text" ||
    e.target.type === "textarea"
  ) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
};

const handleRemoveImage = (index) => {
  setFormData({
    ...formData,
    imageUrls: formData.imageUrls.filter((_, i) => i !== index),
  });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (!currentUser?._id) {
      return setError("You must be signed in to create a listing");
    }
    if (formData.imageUrls.length < 1)
      return setError("You must upload at least one image");
    if (+formData.regularPrice < +formData.discountedPrice)
      return setError("Discount price must be lower than regular price");

    setLoading(true);
    setError(false);

    const res = await fetch("/api/listing/create", {
      method: "POST",
      credentials: "include", // Rely on your HTTP-only cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
    });
    
    const data = await res.json();
    setLoading(false);

    if (!res.ok || data.success === false) {
      setError(data.message);
      return;
    }
    navigate(`/listing/${data._id}`);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};

return (
  <main className="p-3 max-w-4xl mx-auto">
    <h1 className="text-3xl text-slate-700 font-semibold mb-15 mt-10 text-center">Create <span className="text-slate-500">Listing</span></h1>
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
      <div className="flex flex-col flex-1 gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border-3 text-slate-800 autofill:text-slate-800  placeholder:text-slate-700 border-slate-700 p-3 rounded-xl"
          id="name"
          required
          maxLength="62"
          minLength="10"
          onChange={handleChange}
          value={formData.name}
        ></input>
        <textarea
          type="text"
          placeholder="Description"
          id="description"
          required
          className="border-3 autofill:text-slate-800 text-slate-800 border-slate-700 p-3 rounded-xl "
          onChange={handleChange}
          value={formData.description}
        ></textarea>
        <input
          type="text"
          placeholder="Address"
          className="border-3 autofill:text-slate-800 text-slate-800 placeholder:text-slate-700 border-slate-700 p-3 rounded-xl "
          id="address"
          required
          maxLength="62"
          minLength="10"
          onChange={handleChange}
          value={formData.address}
        ></input>
        <div className="flex text-slate-700 flex-wrap gap-4">
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="sale"
              className="w-5"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <span>Sale</span>
          </div>
          <div className=" text-slate-700 flex gap-2">
            <input
              type="checkbox"
              id="parking"
              className="w-5"
              onChange={handleChange}
              checked={formData.parking}
            />
            <span>Parking</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="rent"
              className="w-5"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />

            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="furnished"
              className="w-5"
              onChange={handleChange}
              checked={formData.furnished}
            />

            <span>Furnished</span>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="offer"
              className="w-5"
              onChange={handleChange}
              checked={formData.offer}
            />

            <span>Offer</span>
          </div>
        </div>
        <div className=" text-slate-700 flex flex-wrap gap-6">
          <div className="flex flex-col gap-2 ">
            <input
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              className="p-3 border bg-white border-gray-300 rounded-xl"
              onChange={handleChange}
              value={formData.bedrooms}
            ></input>
            <span>Beds</span>
          </div>
          <div className="flex flex-col  gap-2">
            <input
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              className="p-3 border bg-white border-gray-300 rounded-xl"
              onChange={handleChange}
              value={formData.bathrooms}
            ></input>
            <span>Baths</span>
          </div>
          <div className="flex flex-col  gap-2">
            <input
              type="number"
              id="regularPrice"
              min="50"
              max="1000000"
              required
              className="p-3 border bg-white border-gray-300 rounded-xl"
              onChange={handleChange}
              value={formData.regularPrice}
            ></input>
            <span>Regular Price</span>
            <span className="text-xs">($/Month)</span>
          </div>
          {formData.offer && (
            <div className="flex flex-col  gap-2">
              <input
                type="number"
                id="discountedPrice"
                min="0"
                max="1000000"
                required
                className="p-3 border bg-white border-gray-300 rounded-xl"
                onChange={handleChange}
                value={formData.discountedPrice}
              ></input>
              <span>Discounted Price</span>
              <span className="text-xs">($/Month)</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-5 ml-6">
        <p className="font-semibold-semi">
          Images:
          <span className="font-normal text-gray-600 ml-2">
            The first image will be the cover (max 6)
          </span>
        </p>
        <div className="flex gap-4">
          <input
            onChange={(e) => setFiles(e.target.files)}
            className="p-3 rounded-xl w-full h-15 border-2 bg-white border-gray-300"
            id="images"
            type="file"
            accept="image/*"
            multiple
          ></input>
          <button
            disabled={uploading}
            type="button"
            onClick={handleImageSubmit}
            className="p-3 mb-5 bg-green-700 rounded-xl text-white uppercase hover:bg-transparent hover:text-slate-700 hover:border-3 hover:border-green-700  text-center mt-1.5 "
          >
            {uploading ? "Uploading..." : "Uploading"}
          </button>
        </div>
        <p className="text-red-700 text-sm">
          {imageUploadError && imageUploadError}
        </p>
        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, index) => {
            return (
              <div
                key={url}
                className="flex justify-between h-25 text-slate-700 rounded-xl p-3 border-3 border-slate-700 items-center"
              >
                <img
                  src={url}
                  alt="Listing image"
                  className="w-40 h-20 rounded-xl object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-700 rounded-xl p-3 text-white uppercase hover:bg-transparent hover:text-red-700 hover:border-3 hover:border-red-700"
                >
                  Delete
                </button>
              </div>
            );
          })}
        <button
          disabled={loading || uploading}
          className="bg-slate-700 rounded-xl p-3 text-white uppercase hover:bg-transparent hover:text-slate-700 hover:border-3 hover:border-slate-700"
        >
          {loading ? "Creating..." : "Create listing"}
        </button>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </div>
    </form>
  </main>
)};

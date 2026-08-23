import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { supabase } from "../Components/supabase";
export default function updateListing() {
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
  const { listingId } = useParams();

  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchListing = async ()=>{
        const res = await fetch(`/api/listing/get/${listingId}`)
        const data = await res.json();
        if(data.success===false){
            console.log(data.message)
            return;
        }
        setFormData(data);
    };
    fetchListing();
  }, [listingId]);

  const handleImageSubmit = (e) => {
    setUploading(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    try {
      const filename = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("Mern-Estate")
        .upload(filename, file);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("Mern-Estate")
        .getPublicUrl(filename);

      return publicUrlData.publicUrl;
    } catch (error) {
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
    if (!listingId || !currentUser?._id) {
      return setError("You must be signed in to update this listing");
    }
    if (formData.imageUrls.length < 1)
      return setError("You must upload at least one image");
    if (+formData.regularPrice < +formData.discountedPrice)
      return setError("Discount price must be lower than regular price");
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/listing/update/${listingId}`, {
      method: "POST",
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
    if (!res.ok || data.success === false || !data._id) {
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
    <h1 className="text-3xl font-semibold my-7 text-center"> <span className="text-slate-700">Edit</span> <span className="text-slate-500">Listing</span> </h1>
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
      <div className="flex flex-col flex-1 gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border-3 p-3 rounded-xl"
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
          className="border-3 p-3 rounded-xl "
          onChange={handleChange}
          value={formData.description}
        ></textarea>
        <input
          type="text"
          placeholder="Address"
          className="border-3 p-3 rounded-xl "
          id="address"
          required
          maxLength="62"
          minLength="10"
          onChange={handleChange}
          value={formData.address}
        ></input>
        <div className="flex flex-wrap gap-4">
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
          <div className="flex gap-2">
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
        <div className=" flex flex-wrap gap-6">
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
          <p>Offer value: {String(formData.offer)}</p>
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
            className="p-3 mb-5 text-white bg-green-700 rounded-xl text uppercase hover:bg-transparent hover:text-green-700 hover:border-3 hover:border-green-700  text-center mt-1.5 "
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
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="Listing image"
                  className="w-40 h-40 rounded-lg object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-700 rounded-xl p-3 text-white uppercase"
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


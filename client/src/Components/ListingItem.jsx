import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {

  // 🔍 Check the listing and image URLs
  console.log("LISTING:", listing);
  console.log("IMAGE URLS:", listing?.imageUrls);
  console.log("FIRST IMAGE:", listing?.imageUrls?.[0]);

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[260px]">

      <Link to={`/listing/${listing._id}`}>

        <img
          src={listing?.imageUrls?.[0]}
          alt={listing?.name || "Listing image"}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"

          // 🔍 This will tell us if the image URL cannot be loaded
          onError={(e) => {
            console.error("❌ IMAGE FAILED TO LOAD:", listing?.imageUrls?.[0]);
            console.error("Image element:", e.currentTarget);
          }}

          onLoad={() => {
            console.log("✅ IMAGE LOADED:", listing?.imageUrls?.[0]);
          }}
        />

        <div className="p-3 flex flex-col gap-2 w-full">

          <h2 className="font-semibold text-lg truncate text-slate-700">
            {listing.name}
          </h2>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />

            <p className="text-slate-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          <p className="text-slate-500 mt-2 font-semibold">
            $
            {listing.offer
              ? Number(listing.discountedPrice).toLocaleString("en-US")
              : Number(listing.regularPrice).toLocaleString("en-US")}

            {listing.type === "rent" && " / month"}
          </p>

          <div className="text-slate-700 flex gap-4">

            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>

            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>

          </div>

        </div>
      </Link>
    </div>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  console.log(setSidebardata);

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFomUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const orderFromUrl = urlParams.get('order');
    const sortFromUrl = urlParams.get('sort');

    if(
        searchTermFromUrl|| typeFomUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl ||  orderFromUrl
    ){
        setSidebardata({
            searchTerm: searchTermFromUrl || '',
            type: typeFomUrl || 'all',
            parking: parkingFromUrl=== 'true'? true : fasle ,
            furnished: furnishedFromUrl === 'true'? true : fasle ,
            offer: offerFromUrl === 'true'? true : fasle,
            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc',
        });
        
    }

    const fetchListings = async ()=>{
    setLoading(true);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listings/get${searchQuery}`)
    const data = await res.json();
    setListings(data);
    setLoading(false);
   };
   fetchListings();
   
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new SearchURLParams();
    urlParams.set('searchTerm, sidebardata.searchTerm');
    urlParams.set('type, sidebardata.type');
    urlParams.set('parking, sidebardata.parking');
    urlParams.set('furnished, sidebardata.furnished');
    urlParams.set('offer, sidebardata.offer');   
    urlParams.set('order, sidebardata.order');
    urlParams.set('sort, sidebardata.sort');
    const searchQuery = urlParams.toString();
  };

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
   };

   
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 border-slate-700 shadow-2xl md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold text-slate-700">
              Search Term:
            </label>
            <input
              id="searchTerm"
              placeholder="Search..."
              className="border-2 border-slate-700 rounded-xl p-3 w-full"
              type="text"
            />
          </div>

          <div className="flex  gap-2 flex-wrap items-center">
            <label className="font-semibold text-slate-700">Type:</label>

            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-4 h-4 mt-1 " />
              <label className="text-slate-700" htmlFor="all">Rent & Sale</label>
            </div>
          </div>

          <div className="  flex gap-2">
            <input
              type="checkbox"
              id="rent"
              className="w-5"
              onChange={handleChange}
              checked={sidebardata.type === "rent"}
            />
            <span className="text-slate-700">Rent</span>
          </div>

          <div className="flex gap-2">
            <input
              type="checkbox"
              id="sale"
              className="w-5"
              onChange={handleChange}
              checked={sidebardata.type === "sale"}
            />
            <span className="text-slate-700">Sale</span>
          </div>

          <div className="flex gap-2">
            <input
              type="checkbox"
              id="offer"
              className="w-5"
              onChange={handleChange}
              checked={sidebardata.offer}
            />
            <span className="text-slate-700">Offer</span>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold text-slate-700">Amenities:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span className="text-slate-700">Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span className="text-slate-700">Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700">Sort:</label>

            <select
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              id="sort_order"
              className=" text-slate-700 rounded-lg p-3 border-2 border-slate-700"
            >
              <option value="regularPrice_desc">Price high to low</option>

              <option value="regularPrice_asc">Price low to high</option>

              <option value="createdAt_desc">Latest</option>

              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-transparent hover:text-slate-700 hover:border-3">
            Search
          </button>
        </form>
      </div>

      <div>
        <h1 className="font-semibold text-2xl  last:text-slate-500"><span className="text-slate-700">Listing</span> results...</h1>
      </div>
    </div>
  );
}

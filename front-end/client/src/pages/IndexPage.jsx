import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    axios.get("/places")
      .then((res) => {
        setPlaces(res.data);
        setFilteredPlaces(res.data); // initially show all
      })
      .catch((err) => console.error(err));
  }, []);

  const applyFilters = () => {
    const filtered = places.filter((place) => {
      const matchLocation = location === "" || place.address.toLowerCase().includes(location.toLowerCase());
      const matchMinPrice = minPrice === "" || place.price >= parseInt(minPrice);
      const matchMaxPrice = maxPrice === "" || place.price <= parseInt(maxPrice);
      return matchLocation && matchMinPrice && matchMaxPrice;
    });
    setFilteredPlaces(filtered);
  };

  return (
    <div className="mt-8">
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by location"
          className="border p-2 rounded w-full md:w-1/3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min price"
          className="border p-2 rounded w-full md:w-1/6"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          className="border p-2 rounded w-full md:w-1/6"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button
          onClick={applyFilters}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Results */}
      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPlaces.map((place) => (
          <Link key={place._id} to={"/place/" + place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm text-gray-500">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

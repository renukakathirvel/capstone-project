import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);

  const location = searchParams.get("location");
  const date = searchParams.get("date");
  const guests = searchParams.get("guests");

  useEffect(() => {
    axios.get('/api/v1/places', {
      params: {
        location,
        date,
        guests
      }
    }).then(response => {
      setPlaces(response.data);
    });
  }, [location, date, guests]);

  return (
    <div className="mt-4">
      <h1 className="text-xl font-semibold mb-2">Search Results</h1>
      {/* Render results here */}
    </div>
  );
}

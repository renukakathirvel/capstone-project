import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import ReviewForm from "../ReviewForm";
import StarRating from "../StarRating";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Load reviews for the given place
  const loadReviews = async (placeId) => {
    try {
      const { data } = await axios.get(`/reviews/${placeId}`);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  useEffect(() => {
    if (!id) return;

    axios.get(`/places/${id}`)
      .then(response => {
        const loadedPlace = response.data;
        setPlace(loadedPlace);
        loadReviews(loadedPlace._id);
      })
      .catch(err => {
        console.error("Failed to load place", err);
      });
  }, [id]);

  if (!place) return <div className="p-6 text-center">Loading place details...</div>;

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl font-semibold">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>

      <PlaceGallery place={place} />

      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            <p>{place.description}</p>
          </div>
          <p>Check-in: {place.checkIn}</p>
          <p>Check-out: {place.checkOut}</p>
          <p>Max number of guests: {place.maxGuests}</p>
        </div>

        <div>
          <BookingWidget place={place} />
        </div>
      </div>

      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Info</h2>
          <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
            {place.extraInfo}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mt-6 mb-2">Reviews</h2>
          <ReviewForm placeId={place._id} onReviewSubmitted={() => loadReviews(place._id)} />
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((rev, i) => (
              <div key={i} className="border-b py-3">
                <p className="font-semibold flex items-center gap-2">
                  {rev.user?.name || 'User'} <StarRating rating={rev.rating} />
                </p>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import axios from "axios";

export default function BookingPage() {
    const {id} = useParams();
    const [booking,setBooking] = useState(null);
    useEffect(() => {
      if (id) {
         axios.get('/bookings').then(response => {
            const foundBooking = response.data.find(({_id}) => _id === id);
            if (foundBooking) {
               setBooking(foundBooking);
            }
         });
      }
    }, [id]);

    if (!booking) {
    return <div className="text-center mt-8 text-gray-500">Loading booking...</div>;
    }

     return (
        <div className="my-8"> 
          <h1 className="text-3xl">{booking?.place?.title}</h1>
          <AddressLink className="my-2 block">{booking.place.address}</AddressLink> 
          <div className="bg-gray-200 p-6 my-6 rounded-2xl">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl mb-4">Your booking information:</h2>
      <BookingDates booking={booking} />
    </div>
    <div className="bg-primary p-6 text-white rounded-2xl">
      <div>Total price</div>
      <div className="text-3xl">${booking.price}</div>
    </div>
  </div>

  <div className="mt-6 text-right">
    <Link
  to={`/payment/${booking._id}`}
  className="bg-primary text-white px-4 py-2 rounded-full inline-block"
>
  Proceed to Payment
</Link>
  </div>
</div>
      <PlaceGallery place={booking.place} /> 
          </div>
          
     );
}
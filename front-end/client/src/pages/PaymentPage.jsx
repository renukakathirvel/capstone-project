import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BookingDates from "../BookingDates";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();
  const { bookingId } = useParams();

  // ✅ Fetch booking details
  useEffect(() => {
    axios.get('/bookings').then(res => {
      const found = res.data.find(b => b._id === bookingId);
      setBooking(found);
    });
  }, [bookingId]);

  const makePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/payments', {
        method: "UPI",
        bookingId,
      });

      console.log("Payment success:", response.data);
      alert("✅ Payment Successful!");
      navigate('/account/bookings');
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <div className="text-center mt-20">Loading booking info...</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Payment for: {booking.place.title}</h2>
      <BookingDates booking={booking} />
      <div className="text-2xl font-semibold my-4">Total: ₹{booking.price}</div>
      <button
        onClick={makePayment}
        className="bg-primary text-white px-4 py-2 rounded-lg w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay ₹' + booking.price}
      </button>
    </div>
  );
}

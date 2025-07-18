import { useState } from 'react';
import axios from 'axios';

export default function ReviewForm({ placeId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        'http://127.0.0.1:4000/api/v1/reviews',
        { placeId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment('');
      setRating(5); // Optional: reset rating
      onReviewSubmitted(); 
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-white mt-4">
      <label className="block mb-1 font-semibold">Rating:</label>
      <select
        value={rating}
        onChange={e => setRating(Number(e.target.value))}
        className="w-full p-2 border rounded mb-2"
      >
        {[1, 2, 3, 4, 5].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        rows={4}
      />

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Submit
      </button>
    </form>
  );
}

import { FaStar, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating = 0 }) {
  return (
    <div className="text-yellow-500 flex gap-1">
      {[...Array(5)].map((_, i) =>
        i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
      )}
    </div>
  );
}

export default function PlaceImg({ place, index = 0, className = 'w-full h-full object-cover rounded-2xl' }) {
  if (!place?.photos?.length) {
    return null; // ❗ Return null instead of empty string in React
  }

  return (
    <img
      className={className}
      src={`https://airbnb-backend-06yu.onrender.com/uploads/${place.photos[index]}`}
      alt={`Place photo ${index + 1}`}
    />
  );
}

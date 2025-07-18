import { useState } from 'react';

export default function SearchFilters({ onChange }) {
  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    tv: false,
    radio: false,
    pets: false,
    entrance: false,
  });

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;
    const updatedFilters = { ...filters, [name]: checked };
    setFilters(updatedFilters);
    onChange(updatedFilters); // Notify parent component
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
      {Object.entries(filters).map(([key, value]) => (
        <label key={key} className="flex gap-1 items-center text-sm capitalize">
          <input
            type="checkbox"
            name={key}
            checked={value}
            onChange={handleCheckboxChange}
          />
          {key}
        </label>
      ))}
    </div>
  );
}

import { differenceInCalendarDays, format } from "date-fns";

export default function BookingDates({ booking, className }) {
  if (!booking?.checkIn || !booking?.checkOut) return null;
  className = className || "";

  const numberOfNights = differenceInCalendarDays(
    new Date(booking.checkOut),
    new Date(booking.checkIn)
  );

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {/* Moon/Night Icon + Night Count */}
      <div className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
        <span className="font-semibold">{numberOfNights} nights</span>
      </div>

      {/* Check-in */}
      <div className="flex items-center gap-1 ml-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 2.994v2.25m10.5-2.25v2.25M2.25 16.494V7.491a2.25 2.25 0 0 1 2.25-2.25h15a2.25 2.25 0 0 1 2.25 2.25v9.003m-19.5 0a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25"
          />
        </svg>
        {format(new Date(booking.checkIn), "yyyy-MM-dd")}
      </div>

      <span className="text-gray-500">→</span>

      {/* Check-out */}
      <div className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 2.994v2.25m10.5-2.25v2.25M2.25 16.494V7.491a2.25 2.25 0 0 1 2.25-2.25h15a2.25 2.25 0 0 1 2.25 2.25v9.003m-19.5 0a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25"
          />
        </svg>
        {format(new Date(booking.checkOut), "yyyy-MM-dd")}
      </div>
    </div>
  );
}

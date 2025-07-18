import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get(`/places/${id}`).then(({ data }) => {
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  const preInput = (header, description) => (
    <>
      <h2 className="text-2xl mt-4">{header}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </>
  );

  async function savePlace(ev) {
    ev.preventDefault();
    const token = localStorage.getItem('token');
    const placeData = {
      title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut,
      maxGuests, price,
    };

    if (id) {
      await axios.put('/places', { id, ...placeData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post('/places', placeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setRedirect(true);
  }

  if (redirect) return <Navigate to="/account/places" />;

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput('Title', 'Short and catchy title')}
        <input
          type="text"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          placeholder="e.g. My lovely apartment"
        />

        {preInput('Address', 'Location of the place')}
        <input
          type="text"
          value={address}
          onChange={ev => setAddress(ev.target.value)}
          placeholder="e.g. 123 Main St"
        />

        {preInput('Photos', 'More photos = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput('Description', 'Detailed description')}
        <textarea
          className="w-full"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />

        {preInput('Perks', 'Select amenities offered')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput('Extra Info', 'House rules, things to know')}
        <textarea
          className="w-full"
          value={extraInfo}
          onChange={ev => setExtraInfo(ev.target.value)}
        />

        {preInput('Check in/out & Guests', 'Specify timing and guest limit')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check-in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check-out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)}
              placeholder="11:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={ev => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={ev => setPrice(ev.target.value)}
            />
          </div>
        </div>

        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}

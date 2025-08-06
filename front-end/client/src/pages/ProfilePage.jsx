import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [aboutMe, setAboutMe] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleSaveAbout = async () => {
  try {
    const { data } = await axios.put('/about', { aboutMe });
    setUser(data); // Update user context
    setEditMode(false);
  } catch (err) {
    alert("Failed to update About Me");
  }
};


  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    localStorage.removeItem("token");
    setRedirect("/");
    setUser(null);
  }

  useEffect(() => {
  if (user) {
    setAboutMe(user.aboutMe || "");
  }
}, [user]);

  if (!ready) return "Loading...";
  if (ready && !user && !redirect) return <Navigate to={"/login"} />;
  if (redirect) return <Navigate to={redirect} />;

  return (
    <div>
      <AccountNav />

      {subpage === "profile" && (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-6">Profile</h1>
          <div className="flex flex-col md:flex-row gap-8">

            {/* Sidebar */}
            <div className="w-full md:w-1/3 space-y-4">
              <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-4">
                <div className="bg-black text-white text-xl w-12 h-12 rounded-full flex items-center justify-center">
                  {user.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-600">Guest</p>
                </div>
              </div>

              <ul className="space-y-2">
                <li className="font-semibold">📄 About me</li>
              </ul>

              <button onClick={logout} className="w-full bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-700">
                Logout
              </button>

                      </div>

            {/* Main Profile Content */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="flex justify-between items-center">
  <h2 className="text-xl font-semibold">About me</h2>
  {!editMode ? (
    <button className="bg-gray-200 text-sm px-4 py-1 rounded hover:bg-gray-300" onClick={() => setEditMode(true)}>
      Edit
    </button>
  ) : (
    <button className="bg-primary text-white text-sm px-4 py-1 rounded" onClick={handleSaveAbout}>
      Save
    </button>
  )}
</div>

<div className="bg-white p-4 rounded-xl shadow">
  {editMode ? (
    <textarea
      value={aboutMe}
      onChange={(e) => setAboutMe(e.target.value)}
      className="w-full border rounded p-2"
    />
  ) : (
    <p className="text-gray-600">{user.aboutMe || `👋 Hi, I'm ${user.name}! Welcome to my Airbnb clone profile.`}</p>
  )}
</div>
    </div>
          </div>
        </div>
      )}

      {subpage === "places" && <PlacesPage />}
    </div>
  );
}

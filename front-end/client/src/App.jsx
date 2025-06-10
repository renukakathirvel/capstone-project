import './App.css';
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Footer from './pages/FooterPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/placesPage';
import PlacesFormPage from './pages/PlacesFormPage';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axios.defaults.baseURL = 'http://127.0.0.1:4000';

function App() {
   return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<ProfilePage />} />
      <Route path="/account/places" element={<PlacesPage />} />
      <Route path="/account/places/new" element={<PlacesFormPage />} />
      <Route path="/account/places/:id" element={<PlacesFormPage />} />


      
      </Route>   
    </Routes>
    <Footer />
    </UserContextProvider>
    
  )
}

export default App
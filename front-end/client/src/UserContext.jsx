import {createContext, useEffect, useState} from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready,setReady] = useState(false);
  
  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem('token');
      console.log (token)
      if (token) {
        axios.get('/profile', { 
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(({data}) => {
          setUser(data); 
          setReady(true);
        }).catch(() => {
          localStorage.removeItem('token'); // Clear invalid token
          setReady(true);
        });
      } else {
        setReady(true);
      }
    }
  }, []);
  
  return (
    <UserContext.Provider value={{user,setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}
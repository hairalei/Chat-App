import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase.config';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(window.localStorage.getItem('homechat')) || {}
  );

  const resetAuth = () => setCurrentUser({});

  // detects if user logs in and out
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      window.localStorage.setItem('homechat', JSON.stringify(user));
      setCurrentUser((prev) => {
        return { ...prev, ...user };
      });
    });

    return () => unsub();
  }, []);

  // get user's data from local storage so user is still logged in when page reloads
  // useEffect(() => {
  //   const storage = JSON.parse(window.localStorage.getItem('homechat'));
  //   setCurrentUser((prev) => {
  //     return { ...prev, ...storage };
  //   });
  // }, []);

  // get realtime user's profile from database
  // this is for when user updates their profile
  useEffect(() => {
    const getUser = () => {
      const unsub = onSnapshot(
        doc(db, 'users', currentUser.uid),
        (doc) => {
          const res = doc.data();
          setCurrentUser((prev) => {
            return { ...prev, ...res };
          });
        },
        (error) => {
          console.log(error);
        }
      );

      return () => unsub();
    };

    currentUser.uid && getUser();
  }, [currentUser.uid, currentUser.displayName, currentUser.photoURL]);

  return (
    <AuthContext.Provider value={{ currentUser, resetAuth, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

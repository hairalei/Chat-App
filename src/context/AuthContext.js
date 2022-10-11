import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase.config';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  const resetAuth = () => setCurrentUser({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser((prev) => {
        return { ...prev, ...user };
      });
    });

    return () => unsub();
  }, []);

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
    <AuthContext.Provider value={{ currentUser, resetAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

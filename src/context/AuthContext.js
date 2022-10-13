import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase.config';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(window.localStorage.getItem('homechat')) || {}
  );
  const [id, setID] = useState(null);

  const resetAuth = () => {
    setCurrentUser({});
    console.log('reset');
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log(user);
      window.localStorage.setItem('homechat', JSON.stringify(user));
      setID(user?.uid);
      setCurrentUser((prev) => {
        return { ...prev, ...user };
      });
    });

    return () => unsub();
  }, []);

  // useEffect(() => {
  //   const storage = JSON.parse(window.localStorage.getItem('homechat'));
  //   setCurrentUser((prev) => {
  //     return { ...prev, ...storage };
  //   });
  // }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'users', id || 'user'),
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
  }, [id]);

  return (
    <AuthContext.Provider
      value={{ currentUser, resetAuth, setCurrentUser, setID }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

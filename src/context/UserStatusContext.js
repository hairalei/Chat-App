import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase.config';
import { useAuthContext } from './AuthContext';

const UserStatusContext = createContext();

export const UserStatusProvider = ({ children }) => {
  const [userFriends, setUserFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [isDocrefExists, setIsDocrefExists] = useState(false);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    async function fetchDocument() {
      if (currentUser && currentUser.uid) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsDocrefExists(true);
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      }
    }
    fetchDocument();
  }, [currentUser]);

  useEffect(() => {
    if (isDocrefExists) {
      const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
        setUserFriends(doc.data().friends);
      });

      return () => unsub();
    }
  }, [isDocrefExists]);

  useEffect(() => {
    if (userFriends && userFriends.length > 0) {
      userFriends.forEach((friend) => {
        const unsub = onSnapshot(doc(db, 'userStatus', friend.uid), (doc) => {
          setOnlineFriends((prev) => {
            return { ...prev, ...doc.data() };
          });
        });

        return () => unsub();
      });
    }
  }, [userFriends]);

  return (
    <UserStatusContext.Provider value={{ userFriends, onlineFriends }}>
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatusContext = () => {
  return useContext(UserStatusContext);
};

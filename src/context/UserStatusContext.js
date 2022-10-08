import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { db } from '../firebase.config';
import { useAuthContext } from './AuthContext';

const UserStatusContext = createContext();

const INITIAL_STATE = {
  userFriends: [],
  onlineFriends: [],
  isDocrefExists: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_FRIENDS':
      return { ...state, userFriends: action.payload };

    case 'SET_IS_DOCREF_EXISTS':
      return { ...state, isDocrefExists: action.payload };

    case 'SET_ONLINE_FRIENDS':
      return { ...state, onlineFriends: action.payload };

    case 'RESET_STATUS':
      return { ...INITIAL_STATE };
  }
};

export const UserStatusProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const { currentUser } = useAuthContext();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { userFriends, onlineFriends, isDocrefExists } = state;

  const resetStatus = () => {
    dispatch({ type: 'RESET_STATUS' });
  };

  useEffect(() => {
    async function fetchDocument() {
      if (currentUser && currentUser.uid) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          dispatch({ type: 'SET_IS_DOCREF_EXISTS', payload: true });
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
        setData(doc.data().friends);
      });

      return () => unsub();
    }
  }, [isDocrefExists]);

  useEffect(() => {
    if (currentUser && currentUser.uid && data && data.length > 0) {
      const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
        dispatch({ type: 'SET_USER_FRIENDS', payload: doc.data().friends });
      });

      return () => unsub();
    }
  }, [data, currentUser]);

  useEffect(() => {
    if (userFriends && userFriends.length > 0) {
      userFriends.forEach((friend) => {
        const unsub = onSnapshot(doc(db, 'userStatus', friend.uid), (doc) => {
          dispatch({ type: 'SET_ONLINE_FRIENDS', payload: { ...doc.data() } });
        });

        return () => unsub();
      });
    }
  }, [userFriends]);

  return (
    <UserStatusContext.Provider value={{ ...state, resetStatus }}>
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatusContext = () => {
  return useContext(UserStatusContext);
};

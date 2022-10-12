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
import { useChatContext } from './ChatContext';

const UserStatusContext = createContext();

const INITIAL_STATE = {
  userFriends: null,
  onlineFriends: [],
  isDocrefExists: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_FRIENDS':
      return {
        ...state,
        userFriends: action.payload,
      };

    case 'SET_IS_DOCREF_EXISTS':
      return { ...state, isDocrefExists: action.payload };

    case 'SET_ONLINE_FRIENDS':
      return { ...state, onlineFriends: action.payload };

    case 'RESET_STATUS':
      return { ...INITIAL_STATE };
  }
};

export const UserStatusProvider = ({ children }) => {
  const [temp, setTemp] = useState([]);
  const [online, setOnline] = useState({});
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { userFriends, onlineFriends, isDocrefExists } = state;

  const resetStatus = () => {
    setOnline({});
    setTemp([]);
    dispatch({ type: 'RESET_STATUS' });
  };

  const setUserFriends = (user) => {
    dispatch({ type: 'SET_USER_FRIENDS', payload: user });
  };

  // fetch user's data from firestore
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
  }, [currentUser, data?.user?.uid]);

  // set friends in temp array after user's doc is fetched
  useEffect(() => {
    if (isDocrefExists && currentUser) {
      const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
        const isEmpty = doc.data() && Object.keys(doc?.data())?.length === 0;

        !isEmpty && setTemp(doc.data()?.friends);
      });

      return () => unsub();
    }
  }, [isDocrefExists, currentUser]);

  // sets user friends from temp array
  useEffect(() => {
    if (isDocrefExists && currentUser) {
      setUserFriends(temp);
    }
  }, [temp, currentUser]);

  // detects realtime status of friends if they are online or not
  useEffect(() => {
    if (userFriends && userFriends.length > 0) {
      userFriends.forEach((friend) => {
        const unsub = onSnapshot(doc(db, 'userStatus', friend.uid), (doc) => {
          setOnline((prev) => {
            return { ...prev, ...doc.data() };
          });
        });

        return () => unsub();
      });
    }
  }, [userFriends, temp]);

  useEffect(() => {
    dispatch({ type: 'SET_ONLINE_FRIENDS', payload: { ...online } });
  }, [online]);

  return (
    <UserStatusContext.Provider
      value={{ ...state, resetStatus, setUserFriends, temp }}
    >
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatusContext = () => {
  return useContext(UserStatusContext);
};

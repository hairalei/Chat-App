import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase.config';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from 'react';
import { useAuthContext } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useAuthContext();
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
    emoji: 'like',
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          ...state,
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      case 'CHANGE_EMOJI':
        return {
          ...state,
          emoji: action.payload,
        };
    }

    return state;
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.user.uid) {
      const combinedId =
        currentUser.uid > state.user.uid
          ? currentUser.uid + state.user.uid
          : state.user.uid + currentUser.uid;

      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        dispatch({
          type: 'CHANGE_EMOJI',
          payload: doc.data()[combinedId]['chatSettings']['chatEmoji'],
        });
      });

      return () => unsub();
    }
  }, [state.user.uid]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};

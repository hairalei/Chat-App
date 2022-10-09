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
    chatId: null,
    user: {},
    emoji: 'like',
    theme: 'blue',
    nickname: {},
  };

  const resetChat = () => {
    dispatch({
      type: 'RESET_STATE',
    });
  };

  const changeUser = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user });
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

      case 'CHANGE_THEME':
        return {
          ...state,
          theme: action.payload,
        };

      case 'CHANGE_NICKNAME':
        return {
          ...state,
          nickname: action.payload,
        };

      case 'RESET_STATE':
        return {
          ...INITIAL_STATE,
        };
    }

    return state;
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.user.uid && currentUser.uid) {
      const combinedId =
        currentUser.uid > state.user.uid
          ? currentUser.uid + state.user.uid
          : state.user.uid + currentUser.uid;

      const unsub = onSnapshot(doc(db, 'userChats', state.user.uid), (doc) => {
        if (!doc.data()[combinedId]) return;

        dispatch({
          type: 'CHANGE_EMOJI',
          payload: doc?.data()[combinedId]['chatSettings']['chatEmoji'],
        });

        dispatch({
          type: 'CHANGE_THEME',
          payload: doc?.data()[combinedId]['chatSettings']['chatTheme'],
        });

        dispatch({
          type: 'CHANGE_NICKNAME',
          payload: doc?.data()[combinedId]['chatSettings']['nickname'],
        });
      });

      return () => unsub();
    }
  }, [state.user]);

  return (
    <ChatContext.Provider
      value={{ data: state, dispatch, resetChat, changeUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};

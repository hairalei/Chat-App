import { Box, Flex } from '@chakra-ui/react';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import { db } from '../firebase.config';
import Message from './Message';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data, resetChat } = useChatContext();

  const bottomRef = useRef(null);

  // reset data payload when new user logs in
  // useEffect(() => {
  //   resetChat();
  // }, []);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (data.chatId) {
      const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => unsub();
    }
  }, [data.chatId]);

  return (
    <Flex direction='column' p={6}>
      {messages.map((message) => {
        return <Message message={message} key={message.id} />;
      })}
      <Box ref={bottomRef} />
    </Flex>
  );
};

export default Messages;

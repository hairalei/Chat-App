import { Box, Flex } from '@chakra-ui/react';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { db } from '../firebase.config';
import Message from './Message';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useChatContext();

  const bottomRef = useRef(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unsub();
  }, [data.chatId]);

  return (
    <Flex direction='column' p={3} py={4} gap={4}>
      {messages.map((message) => {
        return <Message message={message} key={message.id} />;
      })}
      <Box ref={bottomRef} />
    </Flex>
  );
};

export default Messages;

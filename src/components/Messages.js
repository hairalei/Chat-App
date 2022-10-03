import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import Message from './Message';

const Messages = () => {
  return (
    <Flex direction='column' p={3} py={4} gap={4}>
      <Message />
      <Message owner />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
    </Flex>
  );
};

export default Messages;

import React from 'react';
import { Box } from '@chakra-ui/react';
import { Navbar, Search, Chats, Friends } from './';
import { useChatContext } from '../context/ChatContext';

const Sidebar = () => {
  const { data } = useChatContext();
  const color = data.theme;

  return (
    <Box
      as='section'
      flex='1'
      backgroundColor={`${color}.700`}
      color='white'
      overflowY='auto'
      overflowWrap='break-word'
    >
      <Navbar />
      <Search />
      <Chats />
    </Box>
  );
};

export default Sidebar;

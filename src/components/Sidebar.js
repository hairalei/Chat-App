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
      flex='1.2'
      backgroundColor={`${color}.700`}
      color='white'
      overflowY='auto'
      // maxW='100%'
      // overflowX='hidden'
    >
      <Navbar color={color} />
      <Search />
      <Chats color={color} />
    </Box>
  );
};

export default Sidebar;

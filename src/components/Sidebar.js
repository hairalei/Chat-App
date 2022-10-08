import React from 'react';
import { Box } from '@chakra-ui/react';
import { Navbar, Search, Chats, Friends } from './';
import { useChatContext } from '../context/ChatContext';

const Sidebar = ({ onOpen, isOnMobile }) => {
  const { data } = useChatContext();
  const color = isOnMobile ? 'blue' : data.theme;

  return (
    <Box
      as='section'
      flex='1.2'
      backgroundColor={`${color}.700`}
      color='white'
      overflowY='auto'
      overflowX='hidden'
    >
      <Navbar color={color} isOnMobile={isOnMobile} />
      <Search />
      <Chats onOpen={onOpen} color={color} isOnMobile={isOnMobile} />
    </Box>
  );
};

export default Sidebar;

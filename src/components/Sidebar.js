import React from 'react';
import { Box } from '@chakra-ui/react';
import { Navbar, Search, Chats, Friends } from './';

const Sidebar = () => {
  return (
    <Box
      as='section'
      flex='1'
      backgroundColor='blue.700'
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

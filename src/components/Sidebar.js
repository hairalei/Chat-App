import React from 'react';
import { Box } from '@chakra-ui/react';
import { Navbar, Search, Chats } from './';

const Sidebar = () => {
  return (
    <Box as='section' flex='1' backgroundColor='blue.700' color='white'>
      <Navbar />
      <Search />
      <Chats />
    </Box>
  );
};

export default Sidebar;

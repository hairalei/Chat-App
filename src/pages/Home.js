import React from 'react';
import { Box, Center, Container, Flex } from '@chakra-ui/react';
import { Navbar, Sidebar, Chat } from '../components';

const Home = () => {
  return (
    <Flex
      as='main'
      h='100%'
      w='100%'
      alignItems='center'
      justifyContent='center'
    >
      <Box
        w={['100%', '95%', '80%', '75%', '65%']}
        h={['100%', '90%', '80%']}
        borderRadius='2xl'
        backgroundColor='black'
        rounded={['lg', '2xl', '3xl']}
        overflow='hidden'
        boxShadow={['2xl', 'dark-lg']}
      >
        <Flex
          h='100%'
          w='100%'
          backgroundColor='white'
          fontSize={['sm', 'md', 'lg', 'xl']}
        >
          <Sidebar flex='1' backgroundColor='red' />
          <Chat flex='2' />
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;

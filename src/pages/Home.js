import React from 'react';
import { Box, Center, Container, Flex } from '@chakra-ui/react';
import { Navbar, Sidebar, Chat } from '../components';

const Home = () => {
  return (
    <Flex
      as='main'
      backgroundColor='red'
      // h='100%'
      // w='100%'
      alignItems='center'
      justifyContent='center'
      overflow='hidden'
      h='100vh'
      w='100vw'
    >
      {/* <Box maxHeight='90%' maxWidth='100%'> */}
      <Box
        w={['100%', '95%', '80%', '75%', '65%']}
        h={['100%', '90%', '80%']}
        borderRadius='2xl'
        backgroundColor='black'
        rounded={['lg', '2xl', '3xl']}
        boxShadow={['2xl', 'dark-lg']}
        overflow='hidden'
      >
        <Flex
          h='100%'
          w='100%'
          backgroundColor='white'
          fontSize={['sm', 'md', 'lg', 'xl']}
        >
          <Sidebar />
          <Chat />
        </Flex>
      </Box>
      {/* </Box> */}
    </Flex>
  );
};

export default Home;

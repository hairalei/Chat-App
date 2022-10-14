import React from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { Sidebar, Chat } from '../components';

const Home = () => {
  const [isOnMobile] = useMediaQuery('(max-width: 40em)');

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      as='main'
      alignItems='center'
      justifyContent='center'
      h='100vh'
      w='100vw'
    >
      <Box
        w={['100%', '100%', '100%', '80%', '70%']}
        h={['100%', '100%', '100%', '80%']}
        backgroundColor='black'
        rounded={['none', 'none', 'none', '2xl', '3xl']}
        boxShadow={['2xl', 'dark-lg']}
        overflow='hidden'
      >
        <Flex
          h='100%'
          w='100%'
          backgroundColor='white'
          fontSize={['sm', 'md', 'lg', 'xl']}
        >
          <Sidebar onOpen={onOpen} isOnMobile={isOnMobile} />
          {!isOnMobile && <Chat />}

          <Drawer
            size='full'
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                <Chat isOnMobile={isOnMobile} onClose={onClose} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;

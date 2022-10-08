import React from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { Navbar, Sidebar, Chat } from '../components';

const Home = () => {
  const [isOnLaptopAndAbove] = useMediaQuery('(min-width: 62em)');
  const [isOnMobile] = useMediaQuery('(max-width: 40em)');
  console.log(isOnMobile);

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const btnRef = React.useRef();

  // console.log(onOpen);

  return (
    <Flex
      as='main'
      alignItems='center'
      justifyContent='center'
      overflow='hidden'
      h='100vh'
      w='100vw'
    >
      <Box
        w={['100%', '100%', '100%', '80%', '70%']}
        h={['100%', '100%', '100%', '80%']}
        // borderRadius={['0', '0', '2xl']}
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
          {/* <Chat /> */}

          {/* <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
            Open
          </Button> */}
          <Drawer
            size='full'
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                <Chat
                  onOpen={onOpen}
                  isOnMobile={isOnMobile}
                  onClose={onClose}
                />
                {/* <DrawerCloseButton /> */}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;

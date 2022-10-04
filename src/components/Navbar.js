import {
  Container,
  Box,
  Text,
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import logo from '../assets/LOGO.svg';
import { FaChevronCircleDown } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { useAuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useAuthContext();
  const { displayName, photoURL } = currentUser;

  console.log(currentUser);

  return (
    <Flex
      justifyContent='space-around'
      as='nav'
      backgroundColor='blue.900'
      h='20'
      py='2'
    >
      <img src={logo} alt='logo' mx='8' width='42' height='42' />

      <Flex alignItems='center' justifyContent='center'>
        <Menu>
          <MenuButton
            as={Button}
            colorScheme='cyan'
            variant='link'
            rightIcon={<FaChevronCircleDown />}
          >
            <Flex alignItems='center' justifyContent='center'>
              <Avatar name='user' src={photoURL} mr='2' />
              <Text as='span' display={['none', 'inline-block']}>
                {displayName}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList color='blue.900'>
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={() => signOut(auth)}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;

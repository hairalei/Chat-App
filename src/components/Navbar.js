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

const Navbar = () => {
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
              <Avatar
                name='user'
                src='https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
                mr='2'
              />
              <Text as='span' display={['none', 'inline-block']}>
                Hong Dusik
              </Text>
            </Flex>
          </MenuButton>
          <MenuList color='blue.900'>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;

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
  Image,
  useMediaQuery,
  AvatarBadge,
} from '@chakra-ui/react';
import React from 'react';
import logo from '../assets/LOGO.svg';
import logoWithName from '../assets/LogoWithName.svg';
import { FaChevronCircleDown } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase.config';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import ModalButton from './ModalButton';
import { doc, setDoc } from 'firebase/firestore';

const Navbar = () => {
  const { currentUser } = useAuthContext();
  const { displayName, photoURL, email, uid } = currentUser;
  const { dispatch } = useChatContext();
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');

  const handleLogOut = async () => {
    await setDoc(doc(db, 'userStatus', uid), {
      [email]: false,
    });

    signOut(auth);
    dispatch({ type: 'RESET_STATE' });
  };

  return (
    <Flex
      as='nav'
      backgroundColor='blue.900'
      h='20'
      p='2'
      px={3}
      alignItems='center'
    >
      {isLargerThan1400 && <Image src={logoWithName} alt='logo' width={44} />}
      {!isLargerThan1400 && (
        <Image src={logo} alt='logo' width={42} height={42} />
      )}

      <Flex alignItems='center' justifyContent='center' ml='auto'>
        <Menu>
          <MenuButton
            as={Button}
            colorScheme='cyan'
            variant='link'
            rightIcon={<FaChevronCircleDown />}
          >
            <Flex alignItems='center' justifyContent='center'>
              <Avatar name='user' src={photoURL} mr='2'>
                <AvatarBadge boxSize={3} bg='green.500' border='1px' />
              </Avatar>
              <Text as='span' display={['none', 'inline-block']}>
                {displayName}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList color='blue.900'>
            <ModalButton owner />
            <MenuItem
              color='red.500'
              onClick={() => {
                signOut(auth);
                dispatch({ type: 'RESET_STATE' });
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;

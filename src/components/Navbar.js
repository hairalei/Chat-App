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
import { useUserStatusContext } from '../context/UserStatusContext';

const Navbar = ({ color }) => {
  const { currentUser } = useAuthContext();
  const { displayName, photoURL, email, uid } = currentUser;
  const { dispatch } = useChatContext();
  const { resetStatus } = useUserStatusContext();
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');

  const handleLogOut = () => {
    setDoc(doc(db, 'userStatus', uid), {
      [email]: false,
    });

    resetStatus();
    dispatch({ type: 'RESET_STATE' });
    console.log('out');
    signOut(auth);
  };

  return (
    <Flex
      as='nav'
      backgroundColor={`${color}.900`}
      h={20}
      p='2'
      px={[4, 6]}
      alignItems='center'
      maxW='100%'
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
              <Avatar name='user' src={photoURL} mr={3}>
                <AvatarBadge boxSize={3} bg='green.500' border='1px' />
              </Avatar>
              <Box overflowWrap='break-word'>
                <Text
                  as='span'
                  display={['none', 'none', 'inline-block']}
                  wordBreak='break-word'
                  textTransform='capitalize'
                >
                  {displayName && displayName.split(' ')[0]}
                </Text>
              </Box>
            </Flex>
          </MenuButton>
          <MenuList color='blue.900'>
            <ModalButton owner />
            <MenuItem color='red.500' onClick={handleLogOut}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;

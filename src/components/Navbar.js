import {
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
  useToast,
  Modal,
  ModalOverlay,
  useDisclosure,
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

const Navbar = ({ color, isOnMobile }) => {
  const { currentUser, resetAuth, setID } = useAuthContext();
  const { displayName, photoURL, email, uid } = currentUser;
  const { resetChat } = useChatContext();
  const { resetStatus } = useUserStatusContext();
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');
  const toast = useToast();

  const { isOpen, onOpen } = useDisclosure();

  const handleLogOut = () => {
    onOpen();

    setDoc(doc(db, 'userStatus', uid), {
      [email]: false,
    });

    resetStatus();
    resetChat();
    resetAuth();
    setID(null);
    window.localStorage.removeItem('homechat');

    toast({
      title: `Logged out`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    signOut(auth);
  };

  return (
    <>
      <Flex
        as='nav'
        backgroundColor={`${color}.900`}
        h={20}
        p='2'
        px={[4, 6]}
        alignItems='center'
        maxW='100%'
      >
        {isLargerThan1400 || isOnMobile ? (
          <Image src={logoWithName} alt='logo' width={[32, 36, 44]} />
        ) : (
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
                <Avatar name={displayName} src={photoURL} mr={3}>
                  <AvatarBadge
                    boxSize={3}
                    bg='green.500'
                    border='1px'
                    right='3px'
                    bottom='3px'
                  />
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

      <Modal closeOnOverlayClick='false' isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </>
  );
};

export default Navbar;

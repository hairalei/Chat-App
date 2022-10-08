import {
  Flex,
  Box,
  Heading,
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  calc,
  Avatar,
} from '@chakra-ui/react';
import React from 'react';
import { IoPerson, IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { useChatContext } from '../context/ChatContext';
import { Messages, ChatInput } from './';
import ModalButton from './ModalButton';
import { themes } from '../utils/utils';
import { useAuthContext } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import Profile from './Profile';
import AvatarWithBadge from './AvatarWithBadge';
import { useUserStatusContext } from '../context/UserStatusContext';

const Chat = () => {
  const { data } = useChatContext();
  const { currentUser } = useAuthContext();
  const { userFriends } = useUserStatusContext();
  const { dark, light } = themes[data.theme];

  const { isOpen, onOpen, onClose } = useDisclosure();

  // if (userFriends.length < 1) return;

  return (
    <Flex
      as='section'
      flex='2'
      backgroundColor={light}
      direction='column'
      position='relative'
      height='100%'
      maxHeight='100%'
    >
      {/* ========== chat header ========== */}
      <Flex
        as='header'
        color='gray.200'
        backgroundColor={dark}
        h='20'
        py='5'
        px={4}
        alignItems='center'
        justifyContent='space-between'
      >
        {/* user name */}
        {userFriends && userFriends.length > 0 && (
          <Flex gap={2}>
            <AvatarWithBadge src={data.user.photoURL} email={data.user.email} />
            <Heading
              as='h1'
              size={['md', 'lg']}
              fontWeight={{ base: 'normal', md: 'medium' }}
            >
              {data?.nickname[data.user.displayName] || data.user?.displayName}
            </Heading>
          </Flex>
        )}

        {/* icon group */}
        {userFriends && userFriends.length > 0 && (
          <Flex alignItems='center' gap={2}>
            <IconButton
              variant='ghost'
              size='md'
              color='white'
              _hover={{ color: `${data.theme}`, background: 'white' }}
              aria-label='view-profile'
              icon={<Icon as={IoPerson} boxSize={[6, 7]} />}
              onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
              <Profile onClose={onClose} />
            </Modal>{' '}
            <Box>
              <Menu>
                <MenuButton
                  as={IconButton}
                  size='md'
                  colorScheme={data.theme}
                  variant='ghost'
                  aria-label='friend user options'
                  icon={
                    <Icon
                      color='white'
                      _hover={{ color: `${data.theme}`, background: 'white' }}
                      as={IoEllipsisHorizontalSharp}
                      boxSize={[6, 7]}
                    />
                  }
                />
                <MenuList color='blue.900'>
                  <ModalButton title='nickname' />

                  <ModalButton title='emoji' />

                  <ModalButton title='theme' />

                  <MenuItem color='red.500'>Unfriend</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        )}
      </Flex>

      {/* ========== message box ==========  */}
      <Box overflowY='auto' h='100%' mb={20}>
        <Messages />
        {userFriends && userFriends.length > 0 && <ChatInput />}
      </Box>
    </Flex>
  );
};

export default Chat;

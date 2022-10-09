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
import React, { useState } from 'react';
import {
  IoPerson,
  IoEllipsisHorizontalSharp,
  IoArrowBackOutline,
} from 'react-icons/io5';
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
import ProfileButton from './ProfileButton';

const Chat = ({ ref, onOpen, isOnMobile, onClose }) => {
  const { data } = useChatContext();
  const { currentUser } = useAuthContext();
  const { userFriends } = useUserStatusContext();
  const { theme } = data && data;

  const [fullscreen, setFullscreen] = useState(false);

  // const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <Flex
      as='section'
      flex={fullscreen ? '100%' : 2}
      backgroundColor={`${theme}.100`}
      direction='column'
      position='relative'
      height='100%'
      maxHeight='100%'
    >
      {/* ========== chat header ========== */}
      <Flex
        as='header'
        color='gray.200'
        backgroundColor={`${theme}.600`}
        h='20'
        py='5'
        px={4}
        alignItems='center'
        justifyContent='space-between'
      >
        {/* user name */}
        {userFriends && data.chatId && (
          <Flex gap={2}>
            <IconButton
              onClick={isOnMobile ? onClose : handleFullscreen}
              variant='ghost'
              size='md'
              color='white'
              _hover={{ color: `${data.theme}`, background: 'white' }}
              aria-label='back-to-chats'
              icon={<Icon as={IoArrowBackOutline} boxSize={[6, 7]} />}
            />
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
        {userFriends && data.chatId && (
          <Flex alignItems='center' gap={2}>
            <ProfileButton />
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
        {userFriends && data.chatId && <ChatInput />}
      </Box>
    </Flex>
  );
};

export default Chat;

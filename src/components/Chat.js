import {
  Flex,
  Box,
  Heading,
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { IoEllipsisHorizontalSharp, IoArrowBackOutline } from 'react-icons/io5';
import {
  Messages,
  ChatInput,
  ModalButton,
  AvatarWithBadge,
  ProfileButton,
  UnfriendButton,
} from './';
import { useChatContext } from '../context/ChatContext';
import { useUserStatusContext } from '../context/UserStatusContext';
import { useNavigate } from 'react-router-dom';

const Chat = ({ isOnMobile, onClose }) => {
  const { data } = useChatContext();
  const { userFriends } = useUserStatusContext();
  const { theme } = data && data;

  const [fullscreen, setFullscreen] = useState(false);

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // to detect back event in mobile
  useEffect(() => {
    const backEvent = (window.onpopstate = (e) => {
      isOnMobile && onClose();
    });

    return () => backEvent();
  }, []);

  return (
    <Flex
      as='section'
      flex={fullscreen ? '100%' : 2}
      backgroundColor={`${theme}.100`}
      direction='column'
      position='relative'
      height='100%'
      maxHeight='100vh'
    >
      {/* ========== chat header ========== */}
      <Flex
        as='header'
        color='gray.200'
        backgroundColor={`${theme}.600`}
        h={[16, 20]}
        py={5}
        px={[1, 4]}
        alignItems='center'
        justifyContent='space-between'
      >
        {/* user name */}
        {userFriends && data.chatId && (
          <Flex gap={[1, 2]} alignItems='center'>
            <IconButton
              onClick={isOnMobile ? onClose : handleFullscreen}
              variant='ghost'
              size='md'
              color='white'
              _hover={{ color: `${data.theme}`, background: 'white' }}
              aria-label='back-to-chats'
              icon={<Icon as={IoArrowBackOutline} boxSize={[6, 7]} />}
            />
            <AvatarWithBadge
              displayName={data.user.displayName}
              src={data.user.photoURL}
              email={data.user.email}
            />
            <Heading
              as='h1'
              size={['sm', 'md', 'lg']}
              fontWeight={{ base: 'normal', md: 'medium' }}
            >
              {data?.nickname[data.user.username] || data.user?.displayName}
            </Heading>
          </Flex>
        )}

        {/* icon group */}
        {userFriends && data.chatId && (
          <Flex alignItems='center' gap={[1, 2]}>
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

                  <UnfriendButton
                    handleFullscreen={handleFullscreen}
                    fullscreen={fullscreen}
                  />
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        )}
      </Flex>

      {/* ========== message box ==========  */}
      <Box overflowY='auto' mb={20}>
        {userFriends && data.chatId && <Messages />}
        {userFriends && data.chatId && <ChatInput />}
      </Box>
    </Flex>
  );
};

export default Chat;

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
} from '@chakra-ui/react';
import React from 'react';
import { IoPerson, IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { useChatContext } from '../context/ChatContext';
import { Messages, ChatInput } from './';
import ModalButton from './ModalButton';
import { themes } from '../utils/utils';

const Chat = () => {
  const { data } = useChatContext();
  const { dark, light } = themes[data.theme];

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
        px={3}
        alignItems='center'
        justifyContent='space-between'
      >
        {/* user name */}
        <Heading
          as='h1'
          size={['md', 'lg']}
          fontWeight={{ base: 'normal', md: 'medium' }}
        >
          {data.user?.displayName}
        </Heading>

        {/* icon group */}
        <Flex alignItems='center' gap={2}>
          <IconButton
            variant='ghost'
            size='md'
            color='white'
            _hover={{ color: 'blue', background: 'white' }}
            aria-label='view-profile'
            icon={<Icon as={IoPerson} boxSize={[6, 7]} />}
          />

          <Box>
            <Menu>
              <MenuButton
                as={IconButton}
                size='md'
                colorScheme='blue'
                variant='ghost'
                aria-label='add-friend'
                icon={
                  <Icon
                    color='white'
                    _hover={{ color: 'blue', background: 'white' }}
                    as={IoEllipsisHorizontalSharp}
                    boxSize={[6, 7]}
                  />
                }
              />
              <MenuList color='blue.900'>
                <MenuItem>Change Nickname</MenuItem>

                <ModalButton title='emoji' />

                <ModalButton title='theme' />

                <MenuItem color='red.500'>Unfriend</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* ========== message box ==========  */}
      <Box overflowY='auto' h='100%' pb={20}>
        <Messages />
        <ChatInput />
      </Box>
    </Flex>
  );
};

export default Chat;

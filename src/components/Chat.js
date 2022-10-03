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
} from '@chakra-ui/react';
import React from 'react';
import { IoPersonAdd, IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { Messages, ChatInput } from './';

const Chat = () => {
  return (
    <Flex
      as='section'
      flex='2'
      backgroundColor='blue.100'
      direction='column'
      position='relative'
      height='100%'
      maxHeight='100%'
    >
      {/* ========== chat header ========== */}
      <Flex
        as='header'
        color='gray.200'
        backgroundColor='blue.600'
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
          Dusik
        </Heading>

        {/* icon group */}
        <Flex alignItems='center' gap={2}>
          <IconButton
            variant='ghost'
            size='md'
            color='white'
            _hover={{ color: 'blue', background: 'white' }}
            aria-label='add-friend'
            icon={<Icon as={IoPersonAdd} boxSize={[6, 7]} />}
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
                <MenuItem>Change Theme</MenuItem>
                <MenuItem>Block</MenuItem>
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

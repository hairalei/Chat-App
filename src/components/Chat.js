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
import ModalSettings from './ModalSettings';

const Chat = () => {
  const { data } = useChatContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

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

                <MenuItem onClick={onOpen}>Change Emoji</MenuItem>
                <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
                  <ModalSettings title={'emoji'} onClose={onClose} />
                </Modal>

                <MenuItem>Change Theme</MenuItem>

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

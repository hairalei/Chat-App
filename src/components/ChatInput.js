import React from 'react';
import {
  Box,
  Flex,
  FormControl,
  Input,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { BsEmojiSmile, BsImage } from 'react-icons/bs';

const ChatInput = () => {
  return (
    <Flex
      backgroundColor='white'
      h='20'
      position='absolute'
      w='full'
      bottom={0}
      alignItems='center'
      px={2}
    >
      <FormControl display='flex'>
        <Input
          variant='unstyled'
          px={2}
          type='text'
          placeholder='Type a message here...'
        />

        {/* button group  */}
        <Flex>
          {/* should be menu of emojis */}
          <IconButton
            variant='ghost'
            colorScheme='twitter'
            icon={<BsEmojiSmile />}
          />
          <IconButton
            variant='ghost'
            colorScheme='twitter'
            icon={<BsImage />}
          />
          <Button type='submit' variant='ghost' colorScheme='twitter'>
            Send
          </Button>
        </Flex>
      </FormControl>
    </Flex>
  );
};

export default ChatInput;

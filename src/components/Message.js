import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();

  const owner = message.senderId === currentUser.uid;

  console.log(owner);
  console.log(message);

  return (
    <Box color='gray.900' mb={3}>
      <Flex gap={2} direction={owner && 'row-reverse'}>
        <Box m={2}>
          <Avatar
            name="user's friend"
            src={owner ? currentUser.photoURL : data.user.photoURL}
          />
          <Text as='span' display='block' color='gray.500' fontSize='sm'>
            Just now
          </Text>
        </Box>

        {/* message content  */}
        <Flex
          direction='column'
          maxWidth='80%'
          alignItems={owner && 'flex-end'}
        >
          {message.text && (
            <Text
              as='p'
              maxWidth='max-content'
              backgroundColor='white'
              p={3}
              borderRadius='xl'
              borderTopLeftRadius={!owner && 0}
              borderTopRightRadius={owner && 0}
            >
              {message.text}
            </Text>
          )}

          {message.img && (
            <Image
              src={message.img}
              alt='image'
              boxSize='80%'
              objectFit='cover'
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Message;

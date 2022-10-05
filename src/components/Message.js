import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();

  const owner = message.senderId === currentUser.uid;

  return (
    <Box color='gray.900' mb={3}>
      <Flex direction={owner && 'row-reverse'}>
        <Flex
          m={2}
          direction='column'
          maxWidth={16}
          alignItems={owner && 'flex-end'}
        >
          <Avatar
            mt={-3}
            name="user's friend"
            src={owner ? currentUser.photoURL : data.user.photoURL}
          />
          <Text
            as='span'
            display='block'
            color='gray.500'
            fontSize='sm'
            textAlign={owner ? 'right' : 'left'}
          >
            {moment(new Date(message.date.seconds * 1000)).calendar()}
            {/* {new Date(message.date.seconds * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} */}
          </Text>
        </Flex>

        {/* message content  */}
        <Flex
          direction='column'
          maxWidth='60%'
          alignItems={owner && 'flex-end'}
        >
          {message.text && (
            <Text
              as='p'
              maxWidth='max-content'
              backgroundColor={owner ? 'blue.200' : 'white'}
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
              boxSize='90%'
              objectFit='cover'
              mt={2}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Message;

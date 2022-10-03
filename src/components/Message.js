import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const Message = ({ owner }) => {
  return (
    <Box color='gray.900' mb={4}>
      <Flex gap={2} direction={owner && 'row-reverse'} justifyContent='center'>
        <Box m={2}>
          <Avatar
            name="user's friend"
            src='https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
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
          <Text
            as='p'
            maxWidth='max-content'
            backgroundColor='white'
            p={3}
            borderRadius='xl'
            borderTopLeftRadius={!owner && 0}
            borderTopRightRadius={owner && 0}
          >
            Lorem,
          </Text>
          <img
            src='https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt=''
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Message;

import React from 'react';
import { Flex, Avatar, Text, Heading } from '@chakra-ui/react';

const Chats = () => {
  return (
    <Flex
      as='section'
      gap='4'
      direction='column'
      p='2'
      borderBottom='1px'
      borderColor='gray.300'
      pb='3'
    >
      <Flex alignItems='center'>
        {/* profile pic */}
        <Avatar
          name='user'
          src='https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
          mr='2'
        />
        <Flex direction='column' gap='1'>
          {/* name */}
          <Heading as='h4' size='md' fontWeight='medium' color='gray.50'>
            Hong Dusik
          </Heading>

          {/* message */}
          <Text as='p' fontSize='sm' color='gray.300'>
            Annyeong
          </Text>
        </Flex>
      </Flex>

      {/* duplicate */}
      <Flex alignItems='center'>
        <Avatar
          name='user'
          src='https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
          mr='2'
        />
        <Flex direction='column' gap='1'>
          <Heading as='h4' size='md' fontWeight='medium' color='gray.50'>
            Hong Dusik
          </Heading>
          <Text as='p' fontSize='sm' color='gray.300'>
            Annyeong
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Chats;

import { Container, Flex, Input, Avatar, Text } from '@chakra-ui/react';
import React from 'react';

const Search = () => {
  return (
    <div>
      <Input
        variant='flushed'
        type='text'
        id='search'
        placeholder='Search user...'
        _placeholder={{ color: 'gray.400' }}
        px='3'
        mb='4'
      />

      {/* User result  */}
      <Flex
        as='section'
        gap='3'
        direction='column'
        px='2'
        borderBottom='1px'
        borderColor='gray.300'
        pb='3'
      >
        <Flex alignItems='center'>
          <Avatar
            name='user'
            src='https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
            mr='2'
          />
          <Text as='span'>Hong Dusik</Text>
        </Flex>
        <Flex alignItems='center'>
          <Avatar
            name='user'
            src='https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
            mr='2'
          />
          <Text as='span'>Hong Dusik</Text>
        </Flex>
      </Flex>
    </div>
  );
};

export default Search;

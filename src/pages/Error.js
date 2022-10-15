import { Button, Flex, Heading, Image } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import error from '../assets/error.png';

const Error = () => {
  return (
    <Flex
      h='100vh'
      alignItems='center'
      direction='column'
      justifyContent='center'
      gap={2}
    >
      <Image src={error} boxSize={['3xs', '2xs', 'xs', 'sm']} />
      <Heading
        as='h2'
        fontSize={['md', 'lg', '2xl', '4xl']}
        color='purple.800'
        mb={4}
      >
        Page does not exist
      </Heading>
      <Button variant='link' colorScheme='purple'>
        <Link to='/'>Back home</Link>
      </Button>
    </Flex>
  );
};

export default Error;

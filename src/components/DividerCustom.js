import { Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const DividerCustom = () => {
  return (
    <>
      <Flex my={2}>
        <Divider m={4} />
        <Text as='span' color='gray.500' fontSize='sm'>
          or
        </Text>
        <Divider m={4} />
      </Flex>
    </>
  );
};

export default DividerCustom;

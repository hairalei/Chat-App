import { Box, useRadio } from '@chakra-ui/react';
import React from 'react';

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const { color } = props;

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          backgroundColor: `${color ? color.light : 'blue.400'}`,
          color: `${color ? 'transparent' : 'white'}`,
          borderColor: `${color ? color.dark : 'blue.400'}`,
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
        color={color ? 'transparent' : 'blue.900'}
        backgroundColor={color && color.dark}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default RadioCard;

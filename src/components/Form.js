import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Flex,
  Button,
  Center,
  Container,
  Heading,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FcAddImage } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import logo from '../assets/LogoWithName.svg';

const Form = ({ location }) => {
  return (
    <>
      <Center w='100vw' h='100vh' bgGradient='linear(to-r, blue.200, blue.300)'>
        <Container bgColor='gray.50' p='8' rounded='md' boxShadow='xl'>
          <Flex
            display='flex'
            direction='column'
            alignItems={'center'}
            justifyContent='center'
            gap='4'
            mb='7'
          >
            <img src={logo} alt='logo' mx='8' />
            <Heading
              as='h2'
              size='lg'
              display='inline-block'
              textAlign='center'
              color='gray.600'
              fontWeight='normal'
            >
              {location}
            </Heading>
          </Flex>

          <FormControl>
            <Flex direction='column'>
              {/* name */}
              {location === 'Register' && (
                <>
                  <FormLabel htmlFor='name'>Display Name</FormLabel>
                  <Input
                    id='name'
                    type='text'
                    placeholder='Hong Dusik'
                    mb='4'
                  />
                </>
              )}

              {/* email */}
              <FormLabel htmlFor='email'>Email Address</FormLabel>
              <Input
                type='email'
                id='email'
                placeholder='chiefhong@mail.com'
                mb='4'
              />

              {/* password */}
              <FormLabel htmlFor='password'>Password</FormLabel>
              <Input
                type='password'
                id='password'
                placeholder='******'
                mb='4'
              />

              {/* picture  */}
              {location === 'Register' && (
                <>
                  <FormLabel
                    htmlFor='file'
                    display='flex'
                    alignItems='center'
                    cursor='pointer'
                  >
                    <Icon as={FcAddImage} w='12' h='12' mr='2' />
                    <Text as='span' color='gray.500' fontWeight='normal'>
                      Add an avatar
                    </Text>
                  </FormLabel>
                  <Input id='file' type='file' sx={{ display: 'none' }} />
                </>
              )}

              <Button colorScheme='blue' variant='solid' mt='6'>
                Sign Up
              </Button>
            </Flex>
          </FormControl>

          <Text as='p' textAlign='center' color='gray.600' mt='2'>
            {location === 'Register'
              ? 'Already have an account? '
              : 'No account yet? '}

            <Button variant='link' colorScheme='blue'>
              {location === 'Register' ? (
                <Link to='/login'>Login</Link>
              ) : (
                <Link to='/register'>Register</Link>
              )}
            </Button>
          </Text>
        </Container>
      </Center>
    </>
  );
};

export default Form;

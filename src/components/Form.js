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
  Spinner,
} from '@chakra-ui/react';
import { FcAddImage } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import logo from '../assets/LogoWithName.svg';

const Form = ({
  location,
  handleSubmit,
  error,
  isLoading,
  file,
  handleChange,
}) => {
  return (
    <>
      <Center w='100vw' h='100vh' bgGradient='linear(to-r, blue.200, blue.300)'>
        <Container bgColor='gray.50' p='8' rounded='xl' boxShadow='xl'>
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

          {/* =============== form =============== */}
          <FormControl as='form' isInvalid={error} onSubmit={handleSubmit}>
            <Flex direction='column'>
              {/* name */}
              {location === 'Register' && (
                <>
                  <FormLabel htmlFor='name'>Display Name</FormLabel>
                  <Input
                    id='displayName'
                    type='text'
                    placeholder='Hong Dusik'
                    mb='4'
                    onChange={handleChange}
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
                onChange={handleChange}
              />

              {/* password */}
              <FormLabel htmlFor='password'>Password</FormLabel>
              <Input
                type='password'
                id='password'
                placeholder='******'
                _placeholder={{ letterSpacing: ' 2px', fontSize: '20px' }}
                mb='4'
                onChange={handleChange}
              />

              {/* confirm password  */}
              {location === 'Register' && (
                <>
                  <FormLabel htmlFor='password'>Confirm Password</FormLabel>
                  <Input
                    type='password'
                    id='confirmPassword'
                    placeholder='******'
                    _placeholder={{ letterSpacing: ' 2px', fontSize: '20px' }}
                    mb='4'
                    onChange={handleChange}
                  />
                </>
              )}

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
                      {file
                        ? file.name.length > 35
                          ? `${file.name.substring(0, 30)}...${file.name.slice(
                              -3
                            )}`
                          : file.name
                        : 'Add an avatar'}
                    </Text>
                  </FormLabel>
                  <Input
                    id='file'
                    type='file'
                    sx={{ display: 'none' }}
                    onChange={handleChange}
                  />
                </>
              )}

              {error && <FormErrorMessage>{error}</FormErrorMessage>}

              <Button
                type='submit'
                colorScheme='blue'
                variant='solid'
                mt='6'
                onSubmit={handleSubmit}
                textTransform='uppercase'
                letterSpacing='2px'
              >
                {isLoading ? <Spinner /> : location}
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

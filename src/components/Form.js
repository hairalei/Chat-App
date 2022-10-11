import React, { useState } from 'react';
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
  Box,
  IconButton,
  Image,
  Divider,
} from '@chakra-ui/react';
import { FcAddImage } from 'react-icons/fc';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import logo from '../assets/LogoWithName.svg';
import GoogleButton from './GoogleButton';
import DemoButton from './DemoButton';
import DividerCustom from './DividerCustom';

const Form = ({
  location,
  handleSubmit,
  error,
  isLoading,
  file,
  handleChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <Container bgColor='gray.50' p={[5, 8, 10]} rounded='xl' boxShadow='xl'>
        <Flex
          display='flex'
          direction='column'
          alignItems={'center'}
          justifyContent='center'
          gap='4'
          mb='7'
        >
          <Image width={[40, 52, 56, 64]} src={logo} alt='logo' mx='8' />
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
            <Flex
              direction={['column', 'column', 'row']}
              justifyContent='space-between'
              mb={[4, 4, 0]}
            >
              {/* name */}
              {location === 'Register' && (
                <Flex direction='column'>
                  <FormLabel htmlFor='name'>Display Name</FormLabel>
                  <Input
                    id='displayName'
                    type='text'
                    placeholder='Hong Dusik'
                    mb='4'
                    onChange={handleChange}
                    minLength={1}
                    maxLength='25'
                  />
                </Flex>
              )}

              {/* username */}
              {location === 'Register' && (
                <Flex direction='column'>
                  <FormLabel htmlFor='username'>Username</FormLabel>
                  <Input
                    id='username'
                    type='text'
                    placeholder='hongbanjang24'
                    mb='4'
                    onChange={handleChange}
                    minLength={1}
                    maxLength='20'
                  />
                  <FormHelperText as='p' mt={-2} ml={2} color='blue.500'>
                    Username must be unique
                  </FormHelperText>
                </Flex>
              )}
            </Flex>

            {/* email */}
            <FormLabel htmlFor='email'>Email Address</FormLabel>
            <Input
              type='email'
              id='email'
              placeholder='hongdusik@mail.com'
              mb='4'
              onChange={handleChange}
            />

            {/* password */}
            {location !== 'Forgot Password' && (
              <>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <Box position='relative' mb='4'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    placeholder='******'
                    _placeholder={{ letterSpacing: ' 2px', fontSize: '20px' }}
                    onChange={handleChange}
                    minLength={6}
                  />
                  <IconButton
                    icon={showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                    position='absolute'
                    cursor='pointer'
                    variant='unstyled'
                    right={0}
                    fontSize={24}
                    color='gray.500'
                    onClick={() => setShowPassword(!showPassword)}
                    zIndex='modal'
                    tabIndex={-1}
                  />
                </Box>
              </>
            )}

            {location === 'Login' && (
              <Button
                variant='link'
                colorScheme='blue'
                width='max-content'
                mt={-2}
              >
                <Link to='/forgot-password'>Forgot Password</Link>
              </Button>
            )}

            {/* confirm password  */}
            {location === 'Register' && (
              <>
                <FormLabel htmlFor='confirmPassword'>
                  Confirm Password
                </FormLabel>
                <Box position='relative' mb='4'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='confirmPassword'
                    placeholder='******'
                    _placeholder={{ letterSpacing: ' 2px', fontSize: '20px' }}
                    minLength={6}
                    onChange={handleChange}
                  />
                  <IconButton
                    icon={
                      showConfirmPassword ? (
                        <IoEyeOutline />
                      ) : (
                        <IoEyeOffOutline />
                      )
                    }
                    position='absolute'
                    cursor='pointer'
                    variant='unstyled'
                    right={0}
                    fontSize={24}
                    color='gray.500'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    zIndex='modal'
                  />
                </Box>
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

          {location === 'Login' && (
            <>
              <DividerCustom />
              <GoogleButton />
            </>
          )}

          {location !== 'Forgot Password' ? (
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
          ) : (
            <Button
              variant='link'
              color='blue.400'
              display='block'
              margin='0 auto'
              mt={1}
            >
              <Link to='/login'>Back to Login</Link>
            </Button>
          )}

          {location === 'Login' && (
            <>
              <DividerCustom />

              <Flex gap={1}>
                <DemoButton demoUser={1} />
                <DemoButton demoUser={2} />
              </Flex>
            </>
          )}
        </FormControl>
      </Container>
    </>
  );
};

export default Form;

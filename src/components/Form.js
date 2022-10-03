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
} from '@chakra-ui/react';
import { FcAddImage } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { auth, db, storage } from '../firebase.config';
import logo from '../assets/LogoWithName.svg';
import { async } from '@firebase/util';

const initialFormValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  file: '',
};

const Form = ({ location }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const { displayName, email, password, confirmPassword, file } = formValues;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormValues((prev) => {
      return { ...prev, [id]: value };
    });

    if (e.target.id === 'file') {
      console.log(e.target.files[0].name);
      setFormValues((prev) => {
        return { ...prev, file: e.target.files[0] };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!displayName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // for photo storage
      const metadata = {
        contentType: 'image/jpeg',
      };
      // Create a reference to 'mountains.jpg'
      const storageRef = ref(storage, `${displayName}.jpg`);

      // Create a reference to 'images/mountains.jpg'
      const storageImagesRef = ref(storage, `images/${displayName}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          setError('Photo upload failed');
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(auth.currentUser, {
              displayName,
              photoURL: downloadURL,
            });

            // for firestore database, copy of user's info
            const formDataCopy = {
              ...formValues,
              uid: user.uid,
              displayName,
              photoURL: downloadURL,
            };
            delete formDataCopy.password;
            delete formDataCopy.confirmPassword;
            delete formDataCopy.file;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            await setDoc(doc(db, 'userChats', user.uid), {});
          });
        }
      );

      setError(null);
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setError('Something went wrong.Try again.');
    }
  };

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
                      {file ? file.name : 'Add an avatar'}
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
              >
                {isLoading ? <Spinner /> : 'Sign Up'}
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

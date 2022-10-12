import React, { useState } from 'react';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase.config';

const DemoButton = ({ demoUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const email =
    demoUser === 1
      ? process.env.REACT_APP_DEMOUSER_1
      : process.env.REACT_APP_DEMOUSER_2;
  const password =
    demoUser === 1
      ? process.env.REACT_APP_DEMOUSER_1_PW
      : process.env.REACT_APP_DEMOUSER_2_PW;

  const toast = useToast();

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'userStatus', res.user.uid), {
        [email]: true,
      });

      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Button
        flex={1}
        colorScheme='blue'
        variant='outline'
        onClick={handleDemoSubmit}
        letterSpacing='2px'
        opacity={0.6}
        _hover={{ opacity: 1 }}
        fontSize='sm'
      >
        {isLoading ? <Spinner /> : `Demo User${demoUser}`}
      </Button>
    </>
  );
};

export default DemoButton;

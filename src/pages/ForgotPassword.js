import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import Form from '../components/Form';
import { auth } from '../firebase.config';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = () => {
    setIsLoading(true);

    try {
      sendPasswordResetEmail(auth, email);

      toast({
        description: 'Email sent!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorCode + ':' + errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      minW='100vw'
      minH='100vh'
      bgGradient='linear(to-r, blue.200, blue.300)'
    >
      <Form
        location='Forgot Password'
        error={error}
        isLoading={isLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </Flex>
  );
};

export default ForgotPassword;

import { Button, useToast } from '@chakra-ui/react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase.config';

const GoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const toast = useToast();

  const onGoogleClick = async () => {
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log(user);

      // Check for user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // If user, doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName,
          searchName: user.displayName.toLowerCase(),
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          timestamp: serverTimestamp(),
          username: `${user.displayName.toLowerCase().trim()}${Math.trunc(
            Math.random() * 100
          )}`,
          friends: [],
        });

        await updateProfile(auth.currentUser, {
          photoURL: user.photoURL,
        });

        await setDoc(doc(db, 'userChats', user.uid), {});

        await setDoc(doc(db, 'userStatus', user.uid), {
          [user.email]: true,
        });
      }
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.log(error);
      toast({
        title: 'Google Sign In Error',
        description: 'Something went wrong. Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };
  return (
    <Button
      isLoading={isLoading}
      onClick={onGoogleClick}
      width='full'
      leftIcon={<FcGoogle />}
      variant='outline'
      colorScheme='blue'
    >
      Login with Google
    </Button>
  );
};

export default GoogleButton;

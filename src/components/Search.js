import React, { useState, useEffect } from 'react';
import {
  Container,
  Flex,
  Input,
  Avatar,
  Text,
  FormErrorMessage,
  FormControl,
  Spinner,
  Center,
} from '@chakra-ui/react';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthContext } from '../context/AuthContext';

const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    setHide(true);
  }, []);

  const handleSearch = async (e) => {
    if (e.code !== 'Enter') return;

    setHide(false);
    setError(null);
    setUser(null);
    setIsLoading(true);

    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    );

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError('Sorry, user not found.');
    }

    setIsLoading(false);
  };

  const handleSelect = async () => {
    console.log('click');
    // checks if chats in firestore exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        // craete chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });
      }
      //create use chats
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [combinedId + '.userInfo']: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChats', user.uid), {
        [combinedId + '.userInfo']: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
      setError('Something went wrong. Try again.');
    }

    setUser(null);
    setUsername('');
    setHide(true);
  };

  return (
    <div>
      <Input
        variant='flushed'
        type='text'
        id='search'
        placeholder='Search user...'
        _placeholder={{ color: 'gray.400' }}
        px='3'
        mb='4'
        onChange={(e) => {
          setUsername(e.target.value);
          setHide(true);
        }}
        onKeyDown={handleSearch}
        value={username}
      />
      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {/* User result  */}
      <Flex
        as='section'
        gap='3'
        direction='column'
        px='2'
        borderBottom='1px'
        borderColor='gray.300'
        pb='3'
        display={hide ? 'none' : 'block'}
        onClick={handleSelect}
        cursor='pointer'
      >
        {user && !isLoading ? (
          <Flex alignItems='center'>
            <Avatar name={user.displayName} src={user.photoURL} mr='2' />
            <Text as='span'>{user.displayName}</Text>
          </Flex>
        ) : (
          <Text
            as='p'
            px='2'
            pb='3'
            fontSize='md'
            color='red.300'
            opacity={isLoading ? 0 : 1}
          >
            User does not exists
          </Text>
        )}
        {error && (
          <Text
            as='p'
            px='2'
            pb='3'
            fontSize='md'
            color='red.300'
            opacity={isLoading ? 0 : 1}
          >
            {error}
          </Text>
        )}
      </Flex>
    </div>
  );
};

export default Search;

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
  useToast,
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
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthContext } from '../context/AuthContext';
import Friends from './Friends';
import { async } from '@firebase/util';
import { useUserStatusContext } from '../context/UserStatusContext';
import { useChatContext } from '../context/ChatContext';

const Search = () => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const { currentUser } = useAuthContext();
  const { setUserFriends } = useUserStatusContext();
  const { changeUser } = useChatContext();

  const toast = useToast();

  useEffect(() => {
    setHide(true);
  }, []);

  const handleSearch = async (e) => {
    if (e.code !== 'Enter') return;

    setHide(false);
    setError(null);
    setResults([]);
    setIsLoading(true);

    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    );

    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs.length);

      if (querySnapshot.docs.length === 0) {
        setError('User does not exists');
      }

      querySnapshot.forEach((doc) => {
        setResults((prev) => {
          return [...prev, doc.data()];
        });
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError('Sorry, user not found.');
    }
  };

  const handleSelect = async (user) => {
    // checks if chats in firestore exists, if not create
    if (user.uid === currentUser.uid) {
      toast({
        title: `You can't add yourself! That's just sad...`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    changeUser(user);

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        // craete chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), {
          messages: [],
        });
      }

      //create user chats
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [combinedId + '.userInfo']: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
        },
        [combinedId + '.date']: serverTimestamp(),
        [combinedId + '.chatSettings']: {
          chatEmoji: 'like',
          chatTheme: 'blue',
          nickname: {
            [currentUser.displayName]: currentUser.displayName,
            [user.displayName]: user.displayName,
          },
        },
      });

      await updateDoc(doc(db, 'userChats', user.uid), {
        [combinedId + '.userInfo']: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
        },
        [combinedId + '.date']: serverTimestamp(),
        [combinedId + '.chatSettings']: {
          chatEmoji: 'like',
          chatTheme: 'blue',
          nickname: {
            [currentUser.displayName]: currentUser.displayName,
            [user.displayName]: user.displayName,
          },
        },
      });

      // update friends list
      await updateDoc(doc(db, 'users', currentUser.uid), {
        friends: arrayUnion({
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
        }),
      });

      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayUnion({
          uid: currentUser.uid,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          displayName: currentUser.displayName,
        }),
      });

      toast({
        title: 'Added as friend',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setUserFriends(user);
    } catch (error) {
      console.log(error);
      setError('Something went wrong. Try again.');
    }

    setUsername('');
    setHide(true);
  };

  return (
    <>
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
          setError(null);
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
      {results.map((result, idx) => {
        const { displayName, email, photoURL, uid } = result;

        return (
          <Flex
            key={idx}
            as='section'
            gap='3'
            mb={4}
            direction='column'
            px='2'
            borderBottom='1px'
            borderColor='gray.300'
            pb='3'
            display={hide ? 'none' : 'block'}
            onClick={() => {
              handleSelect(result);
            }}
            cursor='pointer'
          >
            {!isLoading && !error && (
              <Flex alignItems='center'>
                <Avatar name={displayName} src={photoURL} mr='2' />
                <Text as='span'>{displayName}</Text>
              </Flex>
            )}
          </Flex>
        );
      })}
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

      <Friends handleSelect={handleSelect} />
    </>
  );
};

export default Search;

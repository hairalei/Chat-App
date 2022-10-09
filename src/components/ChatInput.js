import React, { useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Button,
  Icon,
  Text,
  useToast,
} from '@chakra-ui/react';
import { BsHandThumbsUp, BsImage } from 'react-icons/bs';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase.config';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { emojis } from '../utils/utils';

const ChatInput = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const { currentUser } = useAuthContext();
  const { data } = useChatContext();

  const toast = useToast();

  const handleSend = async (emoji) => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

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
          console.log(error);
          toast({
            title: 'Upload error',
            description:
              'There was an error in uploading photo. Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    }

    if (text) {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    if (emoji) {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: emoji,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text: emoji || text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text: emoji || text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    setImg(null);
    setText('');
  };

  return (
    <Flex
      backgroundColor='white'
      h='20'
      position='absolute'
      w='full'
      bottom={0}
      alignItems='center'
      px={2}
    >
      <FormControl display='flex'>
        <Input
          variant='unstyled'
          px={2}
          type='text'
          placeholder='Type a message here...'
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
              handleSend();
            }
          }}
          value={text}
        />

        {/* button group  */}
        <Flex alignItems='center' justifyContent='center'>
          <IconButton
            variant='ghost'
            colorScheme='twitter'
            icon={
              (data && emojis[data?.emoji]?.component) || <BsHandThumbsUp />
            }
            onClick={() =>
              handleSend(data && emojis[data.emoji]['emoji']) || '👍🏻'
            }
          />

          <Box mt={2} ml={2} display='flex' alignItems='center'>
            <FormLabel
              htmlFor='file'
              display='flex'
              alignItems='center'
              gap={1}
            >
              <Icon
                cursor='pointer'
                variant='ghost'
                as={BsImage}
                color='blue.500'
              />
              <Text as='span' color='gray.500' fontWeight='light' fontSize='xs'>
                {img && `${img.name.substring(0, 4)}...${img.name.slice(-3)}`}
              </Text>
            </FormLabel>
            {img && (
              <Text
                cursor='pointer'
                as='span'
                color='red.500'
                fontWeight='light'
                fontSize='md'
                onClick={() => setImg(null)}
                mt={-2}
                mr={2}
                ml={-2}
              >
                x
              </Text>
            )}
          </Box>
          <Input
            id='file'
            type='file'
            sx={{ display: 'none' }}
            onChange={(e) => setImg(e.target.files[0])}
          />

          <Button
            variant='ghost'
            colorScheme='twitter'
            onClick={() => handleSend()}
          >
            Send
          </Button>
        </Flex>
      </FormControl>
    </Flex>
  );
};

export default ChatInput;

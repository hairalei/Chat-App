import React, { useEffect } from 'react';
import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import moment from 'moment';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import useLongPress from '../utils/useLongPress';
import {
  arrayRemove,
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase.config';
import { v4 as uuid } from 'uuid';
import { deleteObject, ref } from 'firebase/storage';
import MessageModal from './MessageModal';

const Message = ({ message }) => {
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();
  const { theme } = data;
  const {
    isOpen: isImgOpen,
    onOpen: onImgOpen,
    onClose: onImgClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const { action, handlers } = useLongPress();

  const owner = message.senderId === currentUser.uid;

  useEffect(() => {
    if (action === 'longpress') {
      onOpen();
    }

    // console.log(action);
  }, [action]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message?.text);

    toast({
      title: 'Copied to clipboard!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  const handleDelete = async () => {
    if (message.senderId === data.user.uid) {
      toast({
        title: 'You can only delete your message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (message.text) {
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayRemove({
            date: message.date,
            id: message.id,
            senderId: message.senderId,
            text: message.text,
          }),
        });
      }

      if (message.img) {
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayRemove({
            date: message.date,
            id: message.id,
            senderId: message.senderId,
            img: message.img,
            filename: message.filename,
          }),
        });
      }

      if (message.video) {
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayRemove({
            date: message.date,
            id: message.id,
            senderId: message.senderId,
            video: message.video,
            filename: message.filename,
          }),
        });
      }

      if (message.video || message.img) {
        const file = ref(storage, message.filename);
        deleteObject(file);
      }

      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          info: `${data.nickname[currentUser.username]} unsent a message`,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [data.chatId + '.lastMessage']: {
          info: `${data.nickname[currentUser.username]} unsent a message`,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChats', data.user.uid), {
        [data.chatId + '.lastMessage']: {
          info: `${data.nickname[currentUser.username]} unsent a message`,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });

      toast({
        title: 'You unsent a message',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Delete message error',
        description: 'Something went wrong. Try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
  };

  return (
    <Box
      color='gray.900'
      mb={3}
      {...handlers}
      cursor='pointer'
      onDoubleClick={() => console.log('dbl')}
    >
      {message.info && (
        <Text
          as='p'
          fontSize='xs'
          maxWidth='max-content'
          color='gray.500'
          fontStyle='italic'
          mx='auto'
        >
          {message.info}
        </Text>
      )}
      {!message.info && (
        <Flex direction={owner && 'row-reverse'}>
          <Flex
            m={2}
            direction='column'
            maxWidth={16}
            alignItems={owner && 'flex-end'}
          >
            <Avatar
              mt={-3}
              name={owner ? currentUser.displayName : data.user.displayName}
              src={owner ? currentUser.photoURL : data.user.photoURL}
            />
            <Text
              as='span'
              display='block'
              color='gray.500'
              fontSize='2xs'
              textAlign={owner ? 'right' : 'left'}
              lineHeight={1.2}
              mt={1}
            >
              {moment(new Date(message.date.seconds * 1000)).calendar()}
            </Text>
          </Flex>

          {/* message content  */}
          <Flex
            direction='column'
            maxWidth='60%'
            alignItems={owner && 'flex-end'}
          >
            {message.text && (
              <Text
                as='p'
                maxWidth='max-content'
                backgroundColor={owner ? `${theme}.200` : 'white'}
                p={3}
                borderRadius='xl'
                borderTopLeftRadius={!owner && 0}
                borderTopRightRadius={owner && 0}
              >
                {message.text}
              </Text>
            )}

            {message.img && (
              <Image
                onClick={onImgOpen}
                cursor='pointer'
                src={message.img}
                alt='image'
                boxSize='90%'
                objectFit='cover'
                mt={2}
                fallbackSrc='https://via.placeholder.com/150'
              />
            )}

            {message.video && (
              <>
                <video width='320' height='240' controls>
                  <source src={message.video} type='video/mp4' />
                  <source src={message.video + '.webm'} type='video/webm' />
                  Your browser does not support the video tag.
                </video>
              </>
            )}
          </Flex>
        </Flex>
      )}

      <MessageModal
        open={isImgOpen}
        close={onImgClose}
        size={['md', 'lg', '2xl', '3xl']}
        message={message}
        color='blackAlpha.500'
        preview
      />

      <MessageModal
        open={isOpen}
        close={onClose}
        size='xs'
        message={message}
        color='white'
        handleCopy={handleCopy}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default Message;

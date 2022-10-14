import React from 'react';
import {
  Avatar,
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import moment from 'moment';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();
  const { theme } = data;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const owner = message.senderId === currentUser.uid;

  return (
    <Box color='gray.900' mb={3}>
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
              fontSize='xs'
              textAlign={owner ? 'right' : 'left'}
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
                onClick={onOpen}
                cursor='pointer'
                src={message.img}
                alt='image'
                boxSize='90%'
                objectFit='cover'
                mt={2}
              />
            )}
          </Flex>
        </Flex>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody backgroundColor='blackAlpha.500'>
            {message.img && (
              <Image
                src={message.img}
                alt='image'
                boxSize='100%'
                objectFit='cover'
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Message;

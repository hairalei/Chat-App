import React from 'react';
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';

const MessageModal = ({
  open,
  close,
  size,
  color,
  message,
  handleCopy,
  handleDelete,
  preview,
}) => {
  return (
    <>
      <Modal isOpen={open} onClose={close} isCentered={true} size={size}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody backgroundColor={color}>
            {message.img && preview && (
              <Image
                src={message.img}
                alt='image'
                boxSize='100%'
                objectFit='cover'
                fallbackSrc='https://via.placeholder.com/150'
              />
            )}

            {message.text && !message.img && (
              <Button
                w='90%'
                mb={4}
                variant='ghost'
                colorScheme='blue'
                onClick={handleCopy}
              >
                Copy
              </Button>
            )}

            {!preview && (
              <Button
                w='90%'
                variant='ghost'
                colorScheme='red'
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MessageModal;

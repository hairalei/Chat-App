import { Icon, IconButton, Modal, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { IoPerson } from 'react-icons/io5';
import { useChatContext } from '../context/ChatContext';
import Profile from './Profile';

const ProfileButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useChatContext();

  return (
    <>
      <IconButton
        variant='ghost'
        size='md'
        color='white'
        _hover={{ color: `${data.theme}`, background: 'white' }}
        aria-label='view-profile'
        icon={<Icon as={IoPerson} boxSize={[6, 7]} />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <Profile onClose={onClose} />
      </Modal>
    </>
  );
};

export default ProfileButton;

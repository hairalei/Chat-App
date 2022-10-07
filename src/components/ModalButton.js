import { MenuItem, Modal, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import ModalSettings from './ModalSettings';
import Profile from './Profile';

const ModalButton = ({ title, owner }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {title ? (
        <>
          {' '}
          <MenuItem onClick={onOpen} textTransform='capitalize'>
            Change {title}
          </MenuItem>
          <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
            <ModalSettings title={title} onClose={onClose} />
          </Modal>{' '}
        </>
      ) : (
        <>
          {' '}
          <MenuItem onClick={onOpen} textTransform='capitalize'>
            {owner ? 'My Profile' : 'View Profile'}
          </MenuItem>
          <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
            <Profile title={title} onClose={onClose} owner />
          </Modal>{' '}
        </>
      )}
    </>
  );
};

export default ModalButton;

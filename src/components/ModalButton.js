import { MenuItem, Modal, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import ModalSettings from './ModalSettings';

const ModalButton = ({ title }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MenuItem onClick={onOpen} textTransform='capitalize'>
        Change {title}
      </MenuItem>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalSettings title={title} onClose={onClose} />
      </Modal>
    </>
  );
};

export default ModalButton;

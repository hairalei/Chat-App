import {
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const ChangePasswordButton = ({ handleUpdate, isLoading }) => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  return (
    <>
      <Button
        display='block'
        variant='link'
        colorScheme='red'
        opacity={0.7}
        _hover={{ opacity: 1 }}
        onClick={onOpen}
        my={4}
      >
        Change Password
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform='capitalize'>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box position='relative' mb='4'>
              <Input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='******'
                _placeholder={{ letterSpacing: ' 2px', fontSize: '20px' }}
                onChange={handleChange}
                minLength={6}
                value={newPassword}
              />
              <IconButton
                icon={showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                position='absolute'
                cursor='pointer'
                variant='unstyled'
                right={0}
                fontSize={24}
                color='gray.500'
                onClick={() => setShowPassword(!showPassword)}
                zIndex='modal'
                tabIndex={-1}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={isLoading}
              colorScheme='blue'
              onClick={() => handleUpdate(newPassword)}
            >
              {isLoading ? <Spinner /> : 'Save'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangePasswordButton;

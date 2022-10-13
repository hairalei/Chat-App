import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { IoWarning } from 'react-icons/io5';

const DeactivateButton = ({ handleDeactivate, isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant='link'
        colorScheme='red'
        opacity={0.7}
        _hover={{ opacity: 1 }}
        onClick={onOpen}
        display='block'
      >
        Deactivate Account
      </Button>

      <AlertDialog
        isCentered={true}
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent backgroundColor='red.100'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              <Icon
                as={IoWarning}
                display='block'
                color='red.800'
                boxSize={10}
              />
              Deactivate Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
              <br />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant='ghost' onClick={onClose}>
                Cancel
              </Button>
              <Button
                isDisabled={isLoading}
                colorScheme='red'
                onClick={handleDeactivate}
                ml={3}
              >
                {isLoading ? <Spinner /> : 'Deactivate'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeactivateButton;

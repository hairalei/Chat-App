import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  MenuItem,
  Button,
  useToast,
  Icon,
} from '@chakra-ui/react';
import {
  arrayRemove,
  deleteDoc,
  deleteField,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import { IoWarning } from 'react-icons/io5';

const UnfriendButton = ({ handleFullscreen, fullscreen }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuthContext();
  const { data, resetChat } = useChatContext();
  const toast = useToast();

  const handleDelete = async () => {
    const user = data.user;

    if (user.uid === currentUser.uid) {
      toast({
        title: `You can't delete yourself! That's just sad...`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      resetChat();
      onClose();
      return;
    }

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      await deleteDoc(doc(db, 'chats', combinedId));

      //delete user chats
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [combinedId]: deleteField(),
      });

      await updateDoc(doc(db, 'userChats', user.uid), {
        [combinedId]: deleteField(),
      });

      // delete user from friends list
      await updateDoc(doc(db, 'users', currentUser.uid), {
        friends: arrayRemove({
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
        }),
      });

      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayRemove({
          uid: currentUser.uid,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          displayName: currentUser.displayName,
        }),
      });

      toast({
        title: 'Deleted user from friends list',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }

    fullscreen && handleFullscreen();
    resetChat();
    onClose();
  };

  return (
    <>
      <MenuItem color='red.500' onClick={onOpen} textTransform='capitalize'>
        Unfriend
      </MenuItem>

      <AlertDialog isCentered={true} isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent backgroundColor='red.100'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              <Icon
                as={IoWarning}
                display='block'
                color='red.800'
                boxSize={10}
              />
              Unfriend user
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
              <br />
              All chat history will be deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant='ghost' onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                Unfriend
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UnfriendButton;

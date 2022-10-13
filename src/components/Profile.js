import React, { useState } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Text,
  Avatar,
  Center,
  Icon,
  Flex,
  Spinner,
  Input,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { IoCalendar, IoPeople } from 'react-icons/io5';
import { useAuthContext, updateUserProfile } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import moment from 'moment';
import { useUserStatusContext } from '../context/UserStatusContext';
import { FcAddImage } from 'react-icons/fc';
import { deleteUser, getAuth, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import AlertModal from './AlertModal';
import {
  arrayRemove,
  deleteDoc,
  deleteField,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = ({ onClose, owner }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const { currentUser, resetAuth } = useAuthContext();
  const { data, resetChat } = useChatContext();
  const { resetStatus } = useUserStatusContext();
  const { temp: friendsArr } = useUserStatusContext();
  const { displayName, friends, photoURL, timestamp, username } = data.user;
  const date = owner ? currentUser?.timestamp?.seconds : timestamp?.seconds;
  const numFriends = owner ? currentUser?.friends?.length : friends?.length;

  const [formValues, setFormValues] = useState({
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormValues((prev) => {
      return { ...prev, [id]: value };
    });

    if (e.target.id === 'avatar') {
      setFormValues((prev) => {
        return { ...prev, avatar: e.target.files[0] };
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const { displayName, avatar, photoURL } = formValues;

    if (displayName === currentUser.displayName && !avatar?.name) {
      onClose();
      return;
    }

    updateUserProfile(displayName, avatar);
  };

  const updateUserProfile = async (newName, newFile) => {
    setIsLoading(true);

    try {
      if (!formValues.avatar) {
        await updateProfile(auth.currentUser, {
          displayName: newName,
        });

        await updateDoc(doc(db, 'users', currentUser.uid), {
          displayName: newName,
          searchName: newName,
        });

        toast({
          title: 'Updated profile',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onClose();
        return;
      }

      const metadata = {
        contentType: 'image/jpeg',
      };
      // Create a reference
      const storageRef = ref(storage, `${currentUser.email}.jpg`);

      // Create a reference
      const uploadTask = uploadBytesResumable(storageRef, newFile, metadata);

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
            title: 'Upload failed',
            description: 'Something went wrong. Try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(auth.currentUser, {
              displayName: newName,
              photoURL: downloadURL,
            });

            await updateDoc(doc(db, 'users', currentUser.uid), {
              displayName: newName,
              photoURL: downloadURL,
            });
          });
        }
      );

      setIsLoading(false);
      toast({
        title: 'Updated profile',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        title: 'Update failed',
        description: 'Something went wrong. Try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeactivate = async () => {
    try {
      friendsArr.length > 0 &&
        friendsArr.forEach(async (friend) => {
          const user = friend;
          const combinedId =
            currentUser.uid > user.uid
              ? currentUser.uid + user.uid
              : user.uid + currentUser.uid;

          await deleteDoc(doc(db, 'chats', combinedId));

          //delete user chats
          await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [combinedId]: deleteField(),
          });

          await updateDoc(doc(db, 'userChats', user.uid), {
            [combinedId]: deleteField(),
          });

          // delete user from friends list
          await updateDoc(doc(db, 'users', user.uid), {
            friends: arrayRemove({
              uid: currentUser.uid,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              displayName: currentUser.displayName,
            }),
          });
        });

      await deleteDoc(doc(db, 'users', currentUser.uid));
      await deleteDoc(doc(db, 'userStatus', currentUser.uid));
      await deleteDoc(doc(db, 'userChats', currentUser.uid));
    } catch (error) {
      console.log(error);
      toast({
        title: 'Cannot deactivate',
        description: 'Something went wrong. Try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    deleteUser(auth.currentUser)
      .then(() => {
        console.log('Successfully deleted user');
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });

    toast({
      title: 'Deactivate Account Success',
      description: 'Redirecting to login page',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    resetStatus();
    resetChat();
    resetAuth();
    window.localStorage.removeItem('homechat');
    onClose();
    navigate('/login');
  };

  return (
    <>
      <ModalOverlay />
      <ModalContent overflow='hidden' rounded='lg'>
        <ModalHeader
          fontSize='2xl'
          textTransform='capitalize'
          bgColor='blue.200'
          pb={24}
        ></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            {isEditing ? (
              <>
                <FormLabel
                  htmlFor='avatar'
                  display='flex'
                  alignItems='center'
                  cursor='pointer'
                >
                  <Icon as={FcAddImage} w='12' h='12' mr='2' />
                  <Text as='span' color='gray.500' fontWeight='normal'>
                    {formValues?.avatar?.name
                      ? formValues.avatar.name.length > 35
                        ? `${formValues.avatar.name.substring(
                            0,
                            30
                          )}...${formValues.avatar.name.slice(-3)}`
                        : formValues.avatar.name
                      : 'Upload new avatar'}
                  </Text>
                </FormLabel>
                <Input
                  id='avatar'
                  type='file'
                  sx={{ display: 'none' }}
                  onChange={handleChange}
                />
              </>
            ) : (
              <Avatar
                name={owner ? currentUser.displayName : displayName}
                size='xl'
                mb={4}
                mt={-12}
                src={owner ? currentUser.photoURL : photoURL}
                sx={{ border: '4px solid skyblue' }}
                boxShadow='xl'
              />
            )}
          </Center>
          <Heading
            textTransform='capitalize'
            as='h6'
            fontSize='2xl'
            mb={6}
            textAlign='center'
          >
            {owner ? currentUser.displayName : displayName}'s profile
          </Heading>

          <Heading as='h6' fontSize='lg' mb={2}>
            Display Name
          </Heading>

          {isEditing ? (
            <Input
              type='text'
              id='displayName'
              onChange={handleChange}
              value={formValues.displayName}
            />
          ) : (
            <Text pl={4} mb={4}>
              {owner ? currentUser.displayName : displayName}
            </Text>
          )}

          <Heading as='h6' fontSize='lg' mb={2}>
            Username
          </Heading>
          <Text pl={4} mb={4}>
            {owner ? currentUser.username : username}
          </Text>

          {owner && (
            <>
              <Heading as='h6' fontSize='lg' mb={2}>
                Email
              </Heading>
              <Text pl={4} mb={4}>
                {currentUser.email}
              </Text>
            </>
          )}

          <Flex alignItems='center' gap={3} color='gray.600' mb={4}>
            <Icon as={IoCalendar} boxSize={6} />
            <Text as='span'>
              Joined {moment(new Date(date * 1000)).format('MMM YYYY')}
            </Text>
          </Flex>

          <Flex alignItems='center' gap={3} color='gray.600'>
            <Icon as={IoPeople} boxSize={6} />
            <Text as='span'>
              {numFriends > 0 ? numFriends : 0} Friend{numFriends > 1 && 's'}
            </Text>
          </Flex>

          {isEditing && <AlertModal handleDeactivate={handleDeactivate} />}
        </ModalBody>

        <ModalFooter>
          {owner ? (
            <>
              <Button
                variant='ghost'
                colorScheme='red'
                mr={3}
                onClick={onClose}
              >
                {isEditing ? 'Cancel' : 'Close'}
              </Button>
              <Button
                colorScheme='blue'
                mr={3}
                onClick={isEditing ? handleSave : handleEdit}
              >
                {!isLoading ? isEditing ? 'Save' : 'Edit' : <Spinner />}
              </Button>
            </>
          ) : (
            <Button variant='ghost' colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default Profile;

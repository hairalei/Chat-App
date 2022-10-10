import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Heading,
  Text,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

const Profile = ({ onClose, owner }) => {
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();

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
            <Avatar
              name={owner ? currentUser.displayName : data.user.displayName}
              size='xl'
              mb={6}
              mt={-12}
              src={owner ? currentUser.photoURL : data.user.photoURL}
              sx={{ border: '4px solid skyblue' }}
              boxShadow='xl'
            />
          </Center>
          <Heading
            textTransform='capitalize'
            as='h6'
            fontSize='2xl'
            mb={6}
            textAlign='center'
          >
            {owner ? currentUser.displayName : data.user.displayName}'s profile
          </Heading>
          <Heading as='h6' fontSize='lg' mb={2}>
            Display Name
          </Heading>
          <Text pl={4} mb={4}>
            {owner ? currentUser.displayName : data.user.displayName}
          </Text>
          <Heading as='h6' fontSize='lg' mb={2}>
            Email
          </Heading>
          <Text pl={4}>{owner ? currentUser.email : data.user.email}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default Profile;

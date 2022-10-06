import React, { useState } from 'react';
import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  IconButton,
  Icon,
  RadioGroup,
  Stack,
  Radio,
  useRadioGroup,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { emojis, themes } from '../utils/utils';
import RadioCard from './RadioCard';

import {
  BsHandThumbsUp,
  BsHeart,
  BsEmojiLaughing,
  BsEmojiAngry,
  BsEmojiHeartEyes,
  BsEmojiDizzy,
} from 'react-icons/bs';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

const ModalSettings = ({ title, onClose }) => {
  const [value, setValue] = useState(null);
  const { currentUser } = useAuthContext();
  const { data } = useChatContext();

  const settings = title === 'emoji' ? emojis : themes;
  const key = title === 'emoji' ? 'chatEmoji' : 'chatTheme';
  const options = Object.entries(settings).map((choice) => choice[0]);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'emojis',
    defaultValue: 'like',
    onChange: setValue,
  });

  const group = getRootProps();

  const handleSave = async () => {
    const user = data.user;

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      //create user chats
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [combinedId + '.chatSettings']: {
          [key]: value,
        },
      });

      await updateDoc(doc(db, 'userChats', user.uid), {
        [combinedId + '.chatSettings']: {
          [key]: value,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform='capitalize'>Change {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            flexWrap='wrap'
            alignItems='center'
            justifyContent='center'
            gap={4}
            {...group}
          >
            {options.map((value) => {
              const radio = getRadioProps({ value });
              return (
                <RadioCard key={value} {...radio}>
                  {settings[value].component}
                </RadioCard>
              );
            })}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' variant='ghost' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme='blue'
            onClick={() => {
              handleSave();
              onClose();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default ModalSettings;

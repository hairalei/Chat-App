import React, { useState } from 'react';
import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useRadioGroup,
  Flex,
  Input,
  FormLabel,
} from '@chakra-ui/react';
import { emojis, themes } from '../utils/utils';
import RadioCard from './RadioCard';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuid } from 'uuid';

const ModalSettings = ({ title, onClose }) => {
  const { data } = useChatContext();
  const [value, setValue] = useState(
    title === 'emoji' ? data.emoji : data.theme
  );
  const { currentUser } = useAuthContext();

  const [newNickname, setNewNickname] = useState(data.nickname);

  const settings = title === 'emoji' ? emojis : themes;
  const key = title === 'emoji' ? 'chatEmoji' : 'chatTheme';
  const options = Object.entries(settings).map((choice) => choice[0]);

  //this is for radio button choices of emojis and theme
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: title === 'emoji' ? 'emojis' : 'themes',
    defaultValue: title === 'emoji' ? data.emoji : data.theme,
    onChange: setValue,
  });

  const group = getRootProps();
  // end of radio button

  const handleSave = async (newNickname) => {
    const user = data.user;

    if (newNickname[currentUser.username].trim().length === 0) {
      setNewNickname((prev) => {
        return {
          ...prev,
          [currentUser.username]: currentUser.displayName,
        };
      });
      onClose();
      return;
    }

    if (newNickname[user.username].trim().length === 0) {
      setNewNickname((prev) => {
        return {
          ...prev,
          [user.username]: user.displayName,
        };
      });
      onClose();
      return;
    }

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      if (title === 'nickname') {
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.chatSettings' + '.nickname']: newNickname,
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.chatSettings' + '.nickname']: newNickname,
        });
      }

      if (title === 'emoji' || title === 'theme') {
        //create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.chatSettings' + `.${key}`]: value,
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.chatSettings' + `.${key}`]: value,
        });
      }

      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          info: `${data.nickname[currentUser.username]} changed ${title}`,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [data.chatId + '.lastMessage']: {
          info: `${data.nickname[currentUser.username]} changed ${title}`,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChats', data.user.uid), {
        [data.chatId + '.lastMessage']: {
          info: `${data.nickname[currentUser.username]} changed ${title}`,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(e.target.placeholder);

    setNewNickname((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform='capitalize'>Change {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {title !== 'nickname' ? (
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
                  <RadioCard
                    key={value}
                    {...radio}
                    color={title === 'theme' && settings[value]}
                  >
                    {title === 'emoji' ? settings[value].component : 'color'}
                  </RadioCard>
                );
              })}
            </Flex>
          ) : (
            <>
              <FormLabel textTransform='capitalize'>
                {data.user.displayName}'s nickname
              </FormLabel>
              <Input
                onChange={handleChange}
                type='text'
                id={data.user.username}
                value={newNickname[data.user.username]}
                placeholder={data.user.displayName}
                maxLength={20}
              />
              <FormLabel textTransform='capitalize'>
                {currentUser.displayName}'s nickname
              </FormLabel>
              <Input
                onChange={handleChange}
                type='text'
                id={currentUser.username}
                placeholder={currentUser.displayName}
                value={newNickname[currentUser.username]}
                maxLength={20}
              />
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' variant='ghost' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='blue' onClick={() => handleSave(newNickname)}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default ModalSettings;

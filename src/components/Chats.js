import React, { useState, useEffect } from 'react';
import { Flex, Avatar, Text, Heading } from '@chakra-ui/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

const Chats = () => {
  const [chats, setChats] = useState('');
  const [active, setActive] = useState(null);
  const { currentUser } = useAuthContext();
  const { dispatch } = useChatContext();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => unsub();
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  //automatically select the latest chat when page loads
  useEffect(() => {
    const latestChat = Object.entries(chats)?.sort(
      (a, b) => b[1].date - a[1].date
    )[0];

    latestChat && handleSelect(latestChat[1].userInfo);
  }, [chats]);

  const handleSelect = (userInfo) => {
    dispatch({ type: 'CHANGE_USER', payload: userInfo });
    setActive(userInfo.uid);
  };

  return (
    <Flex as='section' direction='column' pb='3'>
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            const [chatID, userFriend] = chat;
            const { displayName, photoURL, uid } = userFriend.userInfo;

            return (
              <Flex
                alignItems='center'
                cursor='pointer'
                key={chatID}
                backgroundColor={active === uid && 'blue.800'}
                onClick={() => handleSelect(userFriend.userInfo)}
                p={3}
              >
                {/* profile pic */}
                <Avatar name={displayName} src={photoURL} mr='2' />
                <Flex direction='column' gap='1'>
                  {/* name */}
                  <Heading
                    as='h4'
                    size='md'
                    fontWeight='medium'
                    color='gray.50'
                  >
                    {displayName}
                  </Heading>

                  {/* message */}
                  <Text
                    as='p'
                    fontSize='sm'
                    color='gray.300'
                    lineHeight='1.3'
                    fontStyle={userFriend.lastMessage?.info && 'italic'}
                  >
                    {userFriend.lastMessage?.text &&
                    userFriend.lastMessage?.text.length > 50
                      ? userFriend.lastMessage?.text.substring(0, 50) + ' ...'
                      : userFriend.lastMessage?.text}
                    {userFriend.lastMessage?.info &&
                      userFriend.lastMessage?.info}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
    </Flex>
  );
};

export default Chats;

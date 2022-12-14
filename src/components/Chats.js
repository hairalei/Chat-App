import React, { useState, useEffect } from 'react';
import { Flex, Text, Heading } from '@chakra-ui/react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthContext } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';
import AvatarWithBadge from './AvatarWithBadge';
import { useUserStatusContext } from '../context/UserStatusContext';

const Chats = ({ color, onOpen, isOnMobile }) => {
  const [chats, setChats] = useState('');
  const { currentUser } = useAuthContext();
  const { changeUser, data } = useChatContext();
  const { userFriends } = useUserStatusContext();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, 'userChats', currentUser.uid),
        (doc) => {
          if (!doc.data()) return;

          const res = doc.data();

          const data = Object.entries(res).sort(
            (a, b) => b[1].date - a[1].date
          );

          setChats(data);
        },
        (error) => {
          console.log(error);
        }
      );

      return () => unsub();
    };

    currentUser.uid && userFriends?.length > 0 && getChats();
  }, [currentUser.uid, userFriends]);

  //automatically select the latest chat when page loads
  useEffect(() => {
    const getChats = async () => {
      const docRef = doc(db, 'userChats', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && userFriends?.length > 0) {
        handleSelect(
          Object.entries(docSnap.data())?.sort(
            (a, b) => b[1].date - a[1].date
          )[0][1]?.userInfo
        );
      }
    };

    if (currentUser.uid) {
      getChats();
    }
  }, [currentUser.uid, userFriends]);

  const handleSelect = (userInfo) => {
    changeUser(userInfo);
  };

  return (
    <Flex as='section' direction='column' pb='3'>
      {chats &&
        chats.map((chat) => {
          const [chatID, userFriend] = chat;
          const { displayName, photoURL, uid, email } = userFriend.userInfo;

          return (
            <Flex
              alignItems='center'
              cursor='pointer'
              key={chatID}
              backgroundColor={data.user.uid === uid && `${color}.800`}
              onClick={() => {
                handleSelect(userFriend.userInfo);
                isOnMobile && onOpen();
              }}
              p={3}
            >
              {/* profile pic */}
              <AvatarWithBadge
                displayName={displayName}
                email={email}
                name={displayName}
                src={photoURL}
              />
              <Flex direction='column' gap='1'>
                {/* name */}
                <Heading as='h4' size='md' fontWeight='medium' color='gray.50'>
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
                  {userFriend.lastMessage?.info && userFriend.lastMessage?.info}
                </Text>
              </Flex>
            </Flex>
          );
        })}
    </Flex>
  );
};

export default Chats;

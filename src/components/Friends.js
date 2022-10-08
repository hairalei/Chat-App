import { AvatarGroup } from '@chakra-ui/react';
import React from 'react';
import { useUserStatusContext } from '../context/UserStatusContext';
import AvatarWithBadge from './AvatarWithBadge';

const Friends = () => {
  const { userFriends, onlineFriends } = useUserStatusContext();
  return (
    <AvatarGroup size='md' max={4} px={4} mb={4}>
      {userFriends &&
        userFriends.length > 0 &&
        userFriends.map((friend) => {
          const { email, photoURL, uid } = friend;
          return (
            <AvatarWithBadge
              friends
              user={friend}
              key={uid}
              src={photoURL}
              email={email}
            />
          );
        })}
    </AvatarGroup>
  );
};

export default Friends;

import { AvatarGroup } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useUserStatusContext } from '../context/UserStatusContext';
import AvatarWithBadge from './AvatarWithBadge';

const Friends = () => {
  const { userFriends, temp: friends } = useUserStatusContext();

  return (
    <AvatarGroup size='md' max={4} px={4} mb={4}>
      {friends &&
        friends.length > 0 &&
        friends.map((friend) => {
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

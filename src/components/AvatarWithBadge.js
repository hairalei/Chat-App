import { Avatar, AvatarBadge, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useUserStatusContext } from '../context/UserStatusContext';

const AvatarWithBadge = ({ src, email, friends, user, displayName }) => {
  const { onlineFriends } = useUserStatusContext();
  const { dispatch } = useChatContext();

  return (
    <Avatar name={displayName}
      cursor='pointer'
      src={src}
      mr='2'
      onClick={() => {
        if (!friends) return;
        dispatch({ type: 'CHANGE_USER', payload: user });
      }}
    >
      {onlineFriends[email] && <AvatarBadge boxSize={4} bg='green.500' />}
    </Avatar>
  );
};

export default AvatarWithBadge;

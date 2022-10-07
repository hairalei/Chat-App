import { Avatar, AvatarBadge, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useUserStatusContext } from '../context/UserStatusContext';

const AvatarWithBadge = ({ src, email }) => {
  const { onlineFriends } = useUserStatusContext();

  return (
    <Avatar src={src} mr='2'>
      {onlineFriends[email] && <AvatarBadge boxSize={4} bg='green.500' />}
    </Avatar>
  );
};

export default AvatarWithBadge;

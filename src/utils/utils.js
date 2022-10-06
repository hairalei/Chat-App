import {
  BsHandThumbsUp,
  BsHeart,
  BsEmojiLaughing,
  BsEmojiAngry,
  BsEmojiHeartEyes,
  BsEmojiDizzy,
} from 'react-icons/bs';

export const emojis = {
  like: {
    emoji: '👍🏻',
    component: <BsHandThumbsUp />,
  },
  heart: {
    emoji: '❤️',
    component: <BsHeart />,
  },
  laugh: {
    emoji: '😁',
    component: <BsEmojiLaughing />,
  },
  wow: {
    emoji: '😵',
    component: <BsEmojiDizzy />,
  },
  heartEyes: {
    emoji: '😍',
    component: <BsEmojiHeartEyes />,
  },
  angry: {
    emoji: '😠',
    component: <BsEmojiAngry />,
  },
};

export const themes = {
  blue: {
    light: 'blue.100',
    dark: 'blue.600',
  },
  pink: {
    light: 'pink.100',
    dark: 'pink.600',
  },
  red: {
    light: 'red.100',
    dark: 'red.600',
  },
  purple: {
    light: 'purple.100',
    dark: 'purple.600',
  },
  green: {
    light: 'green.100',
    dark: 'green.600',
  },
  teal: {
    light: 'teal.100',
    dark: 'teal.600',
  },
};

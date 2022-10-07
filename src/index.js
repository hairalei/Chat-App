import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { UserStatusProvider } from './context/UserStatusContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <UserStatusProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </UserStatusProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

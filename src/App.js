import { Home, Register, Login } from './pages';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAuthContext } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';
import { useEffect, useState } from 'react';
import PrivateRoute from './pages/PrivateRoute';
import { useChatContext } from './context/ChatContext';

function App() {
  const { currentUser, setCurrentUser } = useAuthContext();
  const { data } = useChatContext();
  const theme = data && data.theme;

  useEffect(() => {
    const storage = JSON.parse(window.localStorage.getItem('homechat'));
    setCurrentUser((prev) => {
      return { ...prev, ...storage };
    });
  }, []);

  return (
    <Box
      minW='100vw'
      minH='100vh'
      // bgGradient='linear(to-r, blue.200, blue.300)'
      bgGradient={`linear(to-r, ${theme}.200, ${theme}.300)`}
    >
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route
              index
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;

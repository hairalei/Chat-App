import { Home, Register, Login } from './pages';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAuthContext } from './context/AuthContext';

function App() {
  const { currentUser } = useAuthContext();

  const PrivateRoute = ({ children }) => {
    if (!currentUser.uid) {
      return <Navigate to='/login' />;
    }

    return children;
  };

  return (
    <Box
      minW='100vw'
      minH='100vh'
      bgGradient='linear(to-r, blue.200, blue.300)'
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
          </Route>
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;

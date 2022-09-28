import { Home, Register, Login } from './pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

function App() {
  return (
    <Box w='100vw' h='100vh' bgGradient='linear(to-r, blue.200, blue.300)'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;

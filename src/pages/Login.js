import React, { useState } from 'react';
import Form from '../components/Form';
import { auth, db } from '../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const { email, password } = formValues;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormValues((prev) => {
      return { ...prev, [id]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'userStatus', res.user.uid), {
        [email]: true,
      });

      setIsLoading(false);
      setError(null);
      navigate('/');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError('Sorry, we could not find your account.');
    }
  };

  return (
    <Form
      location='Login'
      error={error}
      isLoading={isLoading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;

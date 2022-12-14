import React, { useEffect, useState } from 'react';
import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {
  setDoc,
  doc,
  serverTimestamp,
  query,
  getDocs,
  where,
  collection,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase.config';
import { Flex } from '@chakra-ui/react';

const initialFormValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  file: '',
};

const Register = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const { displayName, email, password, confirmPassword, file, username } =
    formValues;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormValues((prev) => {
      return { ...prev, [id]: value };
    });

    if (e.target.id === 'file') {
      setFormValues((prev) => {
        return { ...prev, file: e.target.files[0] };
      });
    }
  };

  // checks realtime if username is taken or not
  useEffect(() => {
    const getUsername = async () => {
      setIsLoading(true);
      setError(null);

      const q = query(
        collection(db, 'users'),
        where('username', '==', username)
      );

      try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length !== 0) {
          setError('Username is already taken');
          setIsLoading(false);
          return;
        }

        querySnapshot.forEach((doc) => {
          console.log(doc.data());
        });

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setError('Something went wrong. Please try again.');
      }
    };

    username && getUsername();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!displayName || !username || !email || !password || !confirmPassword) {
      setIsLoading(false);
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setIsLoading(false);
      setError('Passwords do not match');
      return;
    }

    if (displayName.trim().length > 25 || displayName.trim().length === 0) {
      setIsLoading(false);
      setError('Display Name should be 1 to 25 characters');
      return;
    }

    if (username.trim().length > 20 || username.trim().length === 0) {
      setIsLoading(false);
      setError('Display Name should be 1 to 20 characters');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // for photo storage
      const metadata = {
        contentType: 'image/jpeg',
      };
      // Create a reference
      const storageRef = ref(storage, `${email}.jpg`);

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          setError('Photo upload failed');
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(auth.currentUser, {
              displayName,
              photoURL: downloadURL,
            });

            // for firestore database, copy of user's info
            const formDataCopy = {
              ...formValues,
              uid: user.uid,
              displayName,
              username,
              searchName: displayName.toLowerCase(),
              photoURL: downloadURL,
              friends: [],
            };
            delete formDataCopy.password;
            delete formDataCopy.confirmPassword;
            delete formDataCopy.file;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            await setDoc(doc(db, 'userChats', user.uid), {});

            await setDoc(doc(db, 'userStatus', user.uid), {
              [email]: true,
            });
          });
        }
      );

      setError(null);

      setTimeout(() => {
        navigate('/');
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <Flex
      alignItems='center'
      justifyContent='center'
      minW='100vw'
      minH='100vh'
      bgGradient='linear(to-r, blue.200, blue.300)'
    >
      <Form
        location='Register'
        handleSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
        file={file}
        handleChange={handleChange}
      />
    </Flex>
  );
};

export default Register;

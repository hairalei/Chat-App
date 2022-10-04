import React, { useState } from 'react';
import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase.config';

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
  const { displayName, email, password, confirmPassword, file } = formValues;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormValues((prev) => {
      return { ...prev, [id]: value };
    });

    if (e.target.id === 'file') {
      console.log(e.target.files[0].name);
      setFormValues((prev) => {
        return { ...prev, file: e.target.files[0] };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!displayName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      const storageRef = ref(storage, `${displayName}.jpg`);

      // Create a reference
      const storageImagesRef = ref(storage, `images/${displayName}.jpg`);
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
              photoURL: downloadURL,
            };
            delete formDataCopy.password;
            delete formDataCopy.confirmPassword;
            delete formDataCopy.file;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            await setDoc(doc(db, 'userChats', user.uid), {});
          });
        }
      );

      setError(null);
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setError('Something went wrong.Try again.');
    }
  };

  return (
    <Form
      location='Register'
      handleSubmit={handleSubmit}
      error={error}
      isLoading={isLoading}
      file={file}
      handleChange={handleChange}
    />
  );
};

export default Register;

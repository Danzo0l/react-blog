import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';


export const Registration = () => {

  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors, isValid } 
  } = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    console.log(data);

    if (!data.payload) {
      console.warn('Registration not success');
      return alert('Registration error!');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      console.warn('Registration not success');
      alert('Registration error!');
    }
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>
        <TextField 
            type="text"
            className={styles.field} 
            label="fullName" 
            error={Boolean(errors.fullName?.message)}
            helperText={errors.fullName?.message}
            { ...register('fullName', { required: 'Введите полное имя' })}
            fullWidth 
          />
          <TextField
            type="email"
            className={styles.field}
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            { ...register('email', { required: 'Укажите почту' })}
            fullWidth
          />
          <TextField 
            type="password"
            className={styles.field} 
            label="Пароль" 
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            { ...register('password', { required: 'Введите пароль' })}
            fullWidth 
          />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};

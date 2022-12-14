import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react'; 
import { useState } from 'react';
import { urlsConfig } from '../../urlsConfig';

export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl ] = React.useState('');

  const isEditing = Boolean(id);

  const userData = useSelector((state) => state.auth.data)._id;

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
        console.warn(err.response.data);
      alert(err);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageUrl: imageUrl ? `${imageUrl}` : '',
        tags,
        text: value,
      }

      const { data } =  isEditing 
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);

    } catch (err) {
      console.warn(err);
      alert('Post not created');  
    }
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title);
        setValue(data.text);  
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(' '));
      }).catch(err => {
        console.log(err);
        alert('Error editing');
      });
    }
  }, []);

  
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: '?????????????? ??????????...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('Item') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        ?????????????????? ????????????
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          ??????????????
          </Button>
          <img className={styles.image} src={`${urlsConfig.server_url}${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        value={title}
        onChange={(e) => {setTitle(e.target.value)}}
        placeholder="?????????????????? ????????????..."
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="????????" 
        value={tags}
        onChange={(e) => {setTags(e.target.value)}}
        fullWidth 
      />
      <SimpleMDE className={styles.editor} value={value} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          { isEditing ? '??????????????????' : '????????????????????????' }
        </Button>
        <a href="/">
          <Button size="large">????????????</Button>
        </a>
      </div>
    </Paper>
  );
};

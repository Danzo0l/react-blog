import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "../axios"
import { Post } from "../components/Post";
import ReactMarkdown from "react-markdown";
import { urlsConfig } from '../urlsConfig';


export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.warn(err);
      alert('Ошибочка :(');
    });
  }, []);

  if (isLoading) {
    return (
      <Post isLoading={isLoading} isFullPost />
    );
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? urlsConfig.server_url + data.imageUrl : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <p>
          <ReactMarkdown children={data.text} />
        </p>
      </Post>
    </>
  );
};

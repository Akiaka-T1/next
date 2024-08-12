"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './movie-detail.module.css';

type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailURL: string;
  backGroundImgURL: string;
  youtubeURL: string;
  views: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

const MovieDetail = () => {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className={styles.detailContainer}>
      <h1>{post.title}</h1>
      <img src={post.thumbnailURL} alt={post.title} className={styles.thumbnail} />
      <p>{post.content}</p>
      <img src={post.backGroundImgURL} alt="Background" className={styles.backgroundImage} />
      {post.youtubeURL && (
        <div className={styles.videoContainer}>
          <iframe 
            src={post.youtubeURL} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>
      )}
      <p>Views: {post.views}</p>
      <p>Score: {post.score}</p>
      <p>Created At: {new Date(post.createdAt).toLocaleDateString()}</p>
      <p>Updated At: {new Date(post.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default MovieDetail;

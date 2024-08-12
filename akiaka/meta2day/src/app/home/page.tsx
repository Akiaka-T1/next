"use client";

import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  thumbnailURL: string;
  views: number;
  score: number;
};

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let isMounted = true; // 이 컴포넌트가 마운트되어 있는지 추적

    // Fetch posts from the backend
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setPosts(data.items || []); // 데이터가 없으면 빈 배열로 처리
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) {
          setPosts([]); // 에러가 발생해도 빈 배열로 처리
        }
      });

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 isMounted를 false로 설정
    };
  }, []);

  const placeholderPosts = Array.from({ length: 16 }, (_, index) => ({
    id: index + 1, // 고유 id 생성
    title: 'Coming Soon',
    thumbnailURL: '',
    views: 0,
    score: 0,
  }));

  return (
    <div className={styles.container}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div className={styles.carousel} key={index}>
          <div className={styles.carouselContent}>
            {(posts.length > 0 ? posts : placeholderPosts).slice(index * 4, (index + 1) * 4).map(post => (
              <div className={styles.post} key={post.id}>
                <Link href={`/home/home-detail/${post.id}`}>
                  {post.thumbnailURL ? (
                    <img src={post.thumbnailURL} alt={post.title} className={styles.thumbnail} />
                  ) : (
                    <div className={styles.placeholderBox}>
                      <p>{post.title}</p>
                    </div>
                  )}
                </Link>
                <h3>{post.title}</h3>
                <p>Views: {post.views}</p>
                <p>Score: {post.score}</p>
              </div>
            ))}
          </div>
          <button className={styles.arrowLeft}>◀</button>
          <button className={styles.arrowRight}>▶</button>
        </div>
      ))}
    </div>
  );
};

export default HomePage;

"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  thumbnailURL: string;
  views: number;
  score: number;
  averageRating: number;
  createdAt: string;
  category: {
    id: number;
  };
};

const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '조회순', value: 'views' },
  { label: '평점순', value: 'rating' },
];

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);
  const currentRefs = useRef<number[]>([]);
  const [sortOrder, setSortOrder] = useState<{ [key: number]: string }>({
    1: 'latest',
    2: 'latest',
    3: 'latest',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data.data || []); // Updated to reflect correct response structure
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  const placeholderPosts = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: 'Coming Soon',
    thumbnailURL: '',
  }));

  const scrollCarousel = (index: number, direction: 'left' | 'right', carouselRef: React.RefObject<HTMLDivElement>) => {
    if (carouselRef.current) {
      const filteredPosts = filterPostsByCategory(index + 1);
      const postCount = filteredPosts.length > 0 ? filteredPosts.length : placeholderPosts.length;
      const ITEM_WIDTH = 370;
      const VISIBLE_ITEMS = 5;
      const MAX_POSITION = Math.ceil(postCount / VISIBLE_ITEMS) - 1;

      if (direction === 'right') {
        if (currentRefs.current[index] < MAX_POSITION) {
          currentRefs.current[index]++;
        } else {
          currentRefs.current[index] = 0;
        }
      } else if (direction === 'left') {
        if (currentRefs.current[index] > 0) {
          currentRefs.current[index]--;
        } else {
          currentRefs.current[index] = MAX_POSITION;
        }
      }

      const translateXValue = currentRefs.current[index] * -ITEM_WIDTH * VISIBLE_ITEMS;
      carouselRef.current.style.transform = `translateX(${translateXValue}px)`;
    }
  };

  const filterPostsByCategory = (categoryId: number) => {
    return posts
      .filter(post => post.category.id === categoryId)
      .sort((a, b) => {
        switch (sortOrder[categoryId]) {
          case 'latest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'views':
            return b.views - a.views;
          case 'rating':
            return b.averageRating - a.averageRating;
          default:
            return 0;
        }
      });
  };

  const handleSortChange = (categoryId: number, newSortOrder: string) => {
    setSortOrder(prevState => ({
      ...prevState,
      [categoryId]: newSortOrder,
    }));
  };

  const renderCarousel = (title: string, categoryId: number, index: number) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    currentRefs.current[index] = 0;
    const filteredPosts = filterPostsByCategory(categoryId);

    return (
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselHeader}>
          <h2 className={styles.carouselTitle}>{title}</h2>
          <div className={styles.sortOptions}>
            {SORT_OPTIONS.map(option => (
              <button
                key={option.value}
                className={sortOrder[categoryId] === option.value ? styles.activeSort : ''}
                onClick={() => handleSortChange(categoryId, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.carousel}>
          <button className={styles.arrowLeft} onClick={() => scrollCarousel(index, 'left', carouselRef)}>◀</button>
          <div className={styles.carouselContent} ref={carouselRef}>
            {(filteredPosts.length > 0 ? filteredPosts : placeholderPosts).map((post, i) => (
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
              </div>
            ))}
          </div>
          <button className={styles.arrowRight} onClick={() => scrollCarousel(index, 'right', carouselRef)}>▶</button>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className={styles.container}>
        {renderCarousel('영화', 1, 0)}
        {renderCarousel('음악', 2, 1)}
        {renderCarousel('책', 3, 2)}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {renderCarousel(`${user.nickname}님의 취향 추천 작품`, 1, 0)}
      {renderCarousel(`${user.nickname}님의 MBTI(${user.mbti})에 맞는 작품`, 2, 1)}
      {renderCarousel(`${user.ageGroup}대를 위한 추천 작품`, 3, 2)}
    </div>
  );
};

export default HomePage;

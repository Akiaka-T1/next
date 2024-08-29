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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`);
        const data = await res.json();
        setPosts(data.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////
  //      캐러셀 아이템도 현재 포스팅 된 작품이 없어서 이미지, 제목이 연결되지 않음.     ///
  //      168번 줄의 내용이                                                         ///
  //      메인 케러셀의 아이템이 없으면 메인에서 이미지가 안나오고 placeholder표시      ///
  ////////////////////////////////////////////////////////////////////////////////////

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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 현재 => categoryId가 영화로 분류되어있는 캐러셀에 들어가 있는 item이라서 영화 세부페이지가 열린다.                  //
  //      => 즉, 작품의 categoryid가 아니라 캐러셀의 categoryid를 보고 각 세부페이지를 연다.                           //
  //                                                                                                              //
  // 수정할 => 작품 자체의 categoryid를 가지고 각 캐러셀로 들어가야하고.(이미 되어있음. : renderCarousel 함수)          // 
  //       => 즉, 세부페이지 여는 방식만 작품의 categoryid를 쓰는 걸로 하면 됨. 지금은 들어온 작품이 없어서 보류.        //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const getDetailPageLink = (categoryId: number, postId: number) => {
    switch (categoryId) {
      case 1: // 영화
        return `/home/home-detail/${postId}`;
      case 2: // 음악
        return `/home/music-detail/${postId}`;
      case 3: // 책
        return `/home/book-detail/${postId}`;
      default:
        return `/home/home-detail/${postId}`;
    }
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
                <Link href={getDetailPageLink(categoryId, post.id)}>
                  {post.thumbnailURL ? (
                    <img src={post.thumbnailURL} alt={post.title} className={styles.thumbnail} />
                  ) : (
                    <div className={styles.placeholderBox}>
                      <p>{post.title}</p>
                    </div>
                  )}
                </Link>
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

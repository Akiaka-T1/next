// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import styles from './main.module.css';
// import Link from 'next/link';

// type Post = {
//   id: number;
//   title: string;
//   thumbnailURL: string;
//   views: number;
//   score: number;
// };

// const HomePage = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const currentRefs = useRef<number[]>([]); // 캐러셀별 현재 위치 추적

//   useEffect(() => {
//     fetch('/api/user')
//       .then(res => res.json())
//       .then(data => setUser(data))
//       .catch(err => console.error(err));

//     fetch('/api/posts')
//       .then(res => res.json())
//       .then(data => setPosts(data.items || []))
//       .catch(err => console.error(err));
//   }, []);
  
//   // 임시 placeholder  
//   const placeholderPosts = Array.from({ length: 10 }, (_, index) => ({
//     id: index + 1,
//     title: 'Coming Soon',
//     thumbnailURL: '',
//     views: 0,
//     score: 0,
//   }));

//   const scrollCarousel = (index: number, direction: 'left' | 'right', carouselRef: React.RefObject<HTMLDivElement>) => {
//     if (carouselRef.current) {
//       const postCount = posts.length > 0 ? posts.length : placeholderPosts.length;
//       const ITEM_WIDTH = 370; // 각 아이템의 너비
//       const VISIBLE_ITEMS = 3; // 한 번에 보이는 아이템 수
//       const MAX_POSITION = Math.ceil(postCount / VISIBLE_ITEMS) - 1; // 가능한 최대 위치
  
//       if (direction === 'right') {
//         if (currentRefs.current[index] < MAX_POSITION) {
//           currentRefs.current[index]++;
//         } else {
//           currentRefs.current[index] = 0; // 마지막에 도달하면 처음으로 돌아감
//         }
//       } else if (direction === 'left') {
//         if (currentRefs.current[index] > 0) {
//           currentRefs.current[index]--;
//         } else {
//           currentRefs.current[index] = MAX_POSITION; // 처음에 도달하면 마지막으로 이동
//         }
//       }
  
//       const translateXValue = currentRefs.current[index] * -ITEM_WIDTH * VISIBLE_ITEMS;
//       carouselRef.current.style.transform = `translateX(${translateXValue}px)`;
//     }
//   };
  

//   const renderCarousel = (title: string, posts: Post[], index: number) => {
//     const carouselRef = useRef<HTMLDivElement>(null);
//     currentRefs.current[index] = 0; // 초기 current 값 설정

//     return (
//       <div className={styles.carouselWrapper}>
//         <h2 className={styles.carouselTitle}>{title}</h2>
//         <div className={styles.carousel}>
//           <button className={styles.arrowLeft} onClick={() => scrollCarousel(index, 'left', carouselRef)}>◀</button>
//           <div className={styles.carouselContent} ref={carouselRef}>
//             {(posts.length > 0 ? posts : placeholderPosts).map((post, i) => (
//               <div className={styles.post} key={post.id}>
//                   {/* 해당 포스트의 id로 페이지를 연다. */}
//                    {/* <Link href={`/home/home-detail/${post.id}`}> */}
//                    <Link href={`/home/home-detail`}>
//                   {post.thumbnailURL ? (
//                     <img src={post.thumbnailURL} alt={post.title} className={styles.thumbnail} />
//                   ) : (
//                     <div className={styles.placeholderBox}>
//                       <p>{post.title}</p>
//                     </div>
//                   )}
//                 </Link>
//                 <h3>{post.title}</h3>
//                 <p>Views: {post.views}</p>
//                 <p>Score: {post.score}</p>
//               </div>
//             ))}
//           </div>
//           <button className={styles.arrowRight} onClick={() => scrollCarousel(index, 'right', carouselRef)}>▶</button>
//         </div>
//       </div>
//     );
//   };

//   if (!user) {
//     return (
//       <div className={styles.container}>
//         {renderCarousel("오늘의 추천작", posts, 0)}
//         {renderCarousel("새로운 작품", posts, 1)}
//         {renderCarousel("인기 작품", posts, 2)}
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {renderCarousel(`${user.nickname}님의 취향 추천 작품`, posts, 0)}
//       {renderCarousel(`${user.nickname}님의 MBTI(${user.mbti})에 맞는 작품`, posts, 1)}
//       {renderCarousel(`${user.ageGroup}대를 위한 추천 작품`, posts, 2)}
//     </div>
//   );
// };

// export default HomePage;



// ****************** 백엔드 연동 테스트 코드 ************************// 
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
};

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);
  const currentRefs = useRef<number[]>([]); // 캐러셀별 현재 위치 추적

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.items || [])) // data.items는 백엔드에서 전달된 게시물 배열을 가리킵니다.
      .catch(err => console.error(err));
  }, []);
  
  const placeholderPosts = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: 'Coming Soon',
    thumbnailURL: '',
    views: 0,
    score: 0,
  }));

  const scrollCarousel = (index: number, direction: 'left' | 'right', carouselRef: React.RefObject<HTMLDivElement>) => {
    if (carouselRef.current) {
      const postCount = posts.length > 0 ? posts.length : placeholderPosts.length;
      const ITEM_WIDTH = 370; // 각 아이템의 너비
      const VISIBLE_ITEMS = 5; // 한 번에 보이는 아이템 수
      const MAX_POSITION = Math.ceil(postCount / VISIBLE_ITEMS) - 1; // 가능한 최대 위치
  
      if (direction === 'right') {
        if (currentRefs.current[index] < MAX_POSITION) {
          currentRefs.current[index]++;
        } else {
          currentRefs.current[index] = 0; // 마지막에 도달하면 처음으로 돌아감
        }
      } else if (direction === 'left') {
        if (currentRefs.current[index] > 0) {
          currentRefs.current[index]--;
        } else {
          currentRefs.current[index] = MAX_POSITION; // 처음에 도달하면 마지막으로 이동
        }
      }
  
      const translateXValue = currentRefs.current[index] * -ITEM_WIDTH * VISIBLE_ITEMS;
      carouselRef.current.style.transform = `translateX(${translateXValue}px)`;
    }
  };

  const renderCarousel = (title: string, posts: Post[], index: number) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    currentRefs.current[index] = 0; // 초기 current 값 설정

    return (
      <div className={styles.carouselWrapper}>
        <h2 className={styles.carouselTitle}>{title}</h2>
        <div className={styles.carousel}>
          <button className={styles.arrowLeft} onClick={() => scrollCarousel(index, 'left', carouselRef)}>◀</button>
          <div className={styles.carouselContent} ref={carouselRef}>
            {(posts.length > 0 ? posts : placeholderPosts).map((post, i) => (
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
          <button className={styles.arrowRight} onClick={() => scrollCarousel(index, 'right', carouselRef)}>▶</button>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className={styles.container}>
        {renderCarousel("오늘의 추천작", posts, 0)}
        {renderCarousel("새로운 작품", posts, 1)}
        {renderCarousel("인기 작품", posts, 2)}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {renderCarousel(`${user.nickname}님의 취향 추천 작품`, posts, 0)}
      {renderCarousel(`${user.nickname}님의 MBTI(${user.mbti})에 맞는 작품`, posts, 1)}
      {renderCarousel(`${user.ageGroup}대를 위한 추천 작품`, posts, 2)}
    </div>
  );
};

export default HomePage;

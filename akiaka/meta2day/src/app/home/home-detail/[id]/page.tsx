// "use client";

// import React, { useState, useEffect } from 'react';
// import styles from './movie-detail.module.css';
// import { useSelector } from 'react-redux';

// export default function HomeDetail() {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [reviews, setReviews] = useState<{ rating: number, comment: string, nickname: string }[]>([]);
//   const [alert, setAlert] = useState(''); // 알림 메시지 상태

//   // Redux 상태에서 로그인된 유저 정보 가져오기
//   const loggedInUser = useSelector((state: any) => state.auth.user);

//   const handleStarClick = (index: number) => {
//     setRating(index + 1); // 별은 1부터 5까지 표시
//   };

//   const handleSubmit = () => {
//     if (!loggedInUser) {
//       setAlert('로그인이 필요합니다');
//       return;
//     }

//     if (rating > 0 && comment) {
//       setReviews([...reviews, { rating, comment, nickname: loggedInUser.nickname }]);
//       setRating(0); // 별점 초기화
//       setComment(''); // 코멘트 초기화
//       setAlert(''); // 알림 메시지 초기화
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {/* 메인 이미지 섹션 */}
//       <div className={styles.mainImageSection}>
//         <div className={styles.imagePlaceholder}>Coming Soon</div>
//       </div>

//       <div className={styles.contentSection}>
//         {/* 영화 제목 및 썸네일 섹션 */}
//         <div className={styles.titleSection}>
//           <h1 className={styles.title}>Movie Title - Coming Soon</h1>
//         </div>

//         {/* 영화 정보 섹션 */}
//         <div className={styles.infoSection}>
//           <div className={styles.thumbnailPlaceholder}>
//               <p>Thumbnail Image</p>
//           </div>
//           <div className={styles.movieInfo}>
//               <p>Movie score - Coming Soon</p>
//               <p>Movie Information - Coming Soon</p>
//           </div>
//         </div>
//       </div>

//       {/* 트레일러 섹션 */}
//       <div className={styles.trailerSection}>
//         <div className={styles.trailer}>
//           <div className={styles.trailerPlaceholder}>
//             Trailer - Coming Soon
//           </div>
//         </div>
//       </div>

//       {/* 평점 섹션 */}
//       <div className={styles.ratingSection}>
//         <div className={styles.rating}>
//           <div className={styles.score}>
//             {[...Array(5)].map((_, index) => (
//               <span 
//                 key={index} 
//                 className={`${styles.star} ${index < rating ? styles.filled : ''}`}
//                 onClick={() => handleStarClick(index)}
//               >
//                 ★
//               </span>
//             ))}
//           </div>
//           <textarea 
//             className={styles.commentBox} 
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="후기를 적어주세요"
//           />
//           <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
//         </div>
//         {alert && <div className={styles.alert}>{alert}</div>}
//       </div>

//       {/* 제출된 후기 리스트 */}
//       <div className={styles.reviewList}>
//         {reviews.map((review, index) => (
//           <div key={index} className={styles.reviewItem}>
//             <div className={styles.reviewStars}>
//               {[...Array(review.rating)].map((_, i) => (
//                 <span key={i} className={styles.filled}>★</span>
//               ))}
//             </div>
//             <p className={styles.reviewComment}>{review.comment}</p>
//             <p className={styles.reviewNickname}>- {review.nickname}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// ************************ 백엔드 연동 코드 테스트***************************** //
"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import styles from './movie-detail.module.css';

export default function HomeDetail() {
  const router = useRouter();
  const pathname = usePathname();

  // pathname에서 id 추출 (e.g., "/home/home-detail/1" -> "1")
  const id = pathname.split('/').pop();

  const [post, setPost] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<{ rating: number, comment: string, nickname: string }[]>([]);
  const [alert, setAlert] = useState('');

  const loggedInUser = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    if (!loggedInUser) {
      setAlert('로그인이 필요합니다');
      return;
    }

    if (rating > 0 && comment) {
      setReviews([...reviews, { rating, comment, nickname: loggedInUser.nickname }]);
      setRating(0);
      setComment('');
      setAlert('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainImageSection} style={{ backgroundImage: `url(${post?.backGroundImgURL})` }}>
        {!post?.backGroundImgURL && <div className={styles.imagePlaceholder}>Coming Soon</div>}
      </div>

      <div className={styles.contentSection}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{post?.title || 'Loading...'}</h1>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.thumbnailPlaceholder}>
            {post?.thumbnailURL ? <img src={post.thumbnailURL} alt={post.title} /> : <p>Thumbnail Image</p>}
          </div>
          <div className={styles.movieInfo}>
            <p>{post?.score || 'Loading...'} 점</p>
            <p>{post?.content || 'Loading...'}</p>
          </div>
        </div>
      </div>

      <div className={styles.trailerSection}>
        {post?.youtubeURL ? (
          <iframe
            src={post.youtubeURL}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.trailer}
          />
        ) : (
          <div className={styles.trailerPlaceholder}>Trailer - Coming Soon</div>
        )}
      </div>

      <div className={styles.ratingSection}>
        <div className={styles.rating}>
          <div className={styles.score}>
            {[...Array(5)].map((_, index) => (
              <span 
                key={index} 
                className={`${styles.star} ${index < rating ? styles.filled : ''}`}
                onClick={() => handleStarClick(index)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea 
            className={styles.commentBox} 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="후기를 적어주세요"
          />
          <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
        </div>
        {alert && <div className={styles.alert}>{alert}</div>}
      </div>

      <div className={styles.reviewList}>
        {reviews.map((review, index) => (
          <div key={index} className={styles.reviewItem}>
            <div className={styles.reviewStars}>
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className={styles.filled}>★</span>
              ))}
            </div>
            <p className={styles.reviewComment}>{review.comment}</p>
            <p className={styles.reviewNickname}>- {review.nickname}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

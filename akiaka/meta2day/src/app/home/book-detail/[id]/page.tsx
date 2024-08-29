"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import styles from './book-detail.module.css';

export default function BookDetail() {
  const pathname = usePathname();

  // pathname에서 id 추출 (e.g., "/home/book-detail/1" -> "1")
  const id = pathname.split('/').pop();

  const [post, setPost] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<{ rating: number, comment: string, nickname: string }[]>([]);
  const [alert, setAlert] = useState('');

  const loggedInUser = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${id}`)
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
        {!post?.backGroundImgURL && <div className={styles.imagePlaceholder}>book Coming Soon</div>}
      </div>

      <div className={styles.contentSection}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{post?.title || 'Loading...'}</h1>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.thumbnailPlaceholder}>
            {post?.thumbnailURL ? <img src={post.thumbnailURL} alt={post.title} /> : <p>Thumbnail Image</p>}
          </div>
          <div className={styles.bookInfo}>
            <p>{post?.score || 'Loading...'} 점</p>
            <p>{post?.content || 'Loading...'}</p>
          </div>
        </div>
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

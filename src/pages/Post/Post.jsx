import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Post.module.css';


const Post = ({ post }) => {
  const navigate = useNavigate();
  const { id, title, description, author, createdAt, coverImageUrl, photoURL } = post;
  const firstParagraph = description.split('\n')[0];
  const limitedDescription = firstParagraph.split(' ').slice(0, 50).join(' ') + '...';

  const handleClick = () => {
    navigate(`/publicacao/${id}`);
  };

  return (
    <div className={styles.post} onClick={handleClick}>
        {coverImageUrl && <img src={coverImageUrl} alt="Capa da publicação" className={styles.coverImage} />}
        <p className={styles.author}>Publicado por {author}</p>
        <p className={styles.date}>MAIS RECENTE -- {createdAt.toDate().toLocaleDateString()}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{limitedDescription}</p>
    </div>

  );
};

export default Post;

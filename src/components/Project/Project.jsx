import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Project.module.css';
import { FaArrowAltCircleDown, FaArrowAltCircleRight, FaArrowRight } from 'react-icons/fa';

const Project = ({ project }) => {
  const navigate = useNavigate();
  const { id, title, description, author, createdAt, coverImageUrl } = project;
  const firstParagraph = description.split('\n')[0];
  const limitedDescription = firstParagraph.split(' ').slice(0, 20).join(' ') + '...';

  const handleClick = () => {
    navigate(`/projeto/${id}`);
  };

  return (
    <div className={styles.project} >
      {coverImageUrl && <img src={coverImageUrl} alt="Capa do projeto" className={styles.coverImage} />}
      <p className={styles.author}>Publicado por {author}</p>
      <p className={styles.date}>{createdAt.toDate().toLocaleDateString()}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{limitedDescription}</p>
      <button onClick={handleClick} className={styles.button}><FaArrowRight /></button>
    </div>
  );
};

export default Project;

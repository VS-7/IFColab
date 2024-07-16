import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Post from '../Post/Post';
import CharacterCard from '../../components/CharacterCard/CharacterCard';
import Project from '../../components/Project/Project'; // Importe o componente de detalhes do projeto
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]); // Estado para armazenar os projetos
  const [visiblePosts, setVisiblePosts] = useState(4); // Número inicial de posts visíveis
  const [visibleProjects, setVisibleProjects] = useState(4); // Número inicial de projetos visíveis
  const navigate = useNavigate();
  const projectContainerRef = useRef(null); // Referência para o container de projetos

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'publications'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      postsData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setPosts(postsData);
    };

    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    };

    fetchPosts();
    fetchProjects();
  }, []);

  const handleClick = (id) => {
    navigate(`/publicacao/${id}`);
  };

  const loadMorePosts = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 4);
  };

  const loadMoreProjects = () => {
    setVisibleProjects(prevVisibleProjects => prevVisibleProjects + 4);
  };

  const mostRecentPost = posts[0];
  const olderPosts = posts.slice(1, visiblePosts); // Limitar posts visíveis
  const visibleProjectsList = projects.slice(0, visibleProjects); // Limitar projetos visíveis

  const scrollProjects = (direction) => {
    const container = projectContainerRef.current;
    const scrollOffset = 300; // Quantidade de scroll em pixels
    if (direction === 'left') {
      container.scrollLeft -= scrollOffset;
    } else if (direction === 'right') {
      container.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.posts}>
          {mostRecentPost && (
            <>
              <div className={styles.recentPost}>
                <Post post={mostRecentPost} />
              </div>
              <div className={styles.moreEditions}>
                <div className={styles.maisEdicoes}>
                  <h5>MAIS EDIÇÕES</h5> <hr />
                </div>
                <div className={styles.editionsContainer}>
                  {olderPosts.map(post => (
                    <div
                      key={post.id}
                      className={styles.editionPost}
                      onClick={() => handleClick(post.id)}
                    >
                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                      <p className={styles.date}>
                        {post.createdAt.toDate().toLocaleDateString()} Publicado por {post.author}
                      </p>
                    </div>
                  ))}
                </div>
                {visiblePosts < posts.length && ( // Mostrar botão apenas se houver mais posts
                  <button className={styles.loadMoreButton} onClick={loadMorePosts}>
                    Ver mais edições
                  </button>
                )}
              </div>
            </>
          )}
        </section>
        <aside className={styles.sidebar}>
          <div className={styles.about}>
            <div className={styles.maisEdicoes}>
              <h5>SOBRE</h5> <hr />
            </div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ifmobile-dd43d.appspot.com/o/logo_borda.png?alt=media&token=d174632d-0979-4d6f-8dc5-53ea28fe81ce"
              alt="logo"
              className={styles.logo}
            />
            <p>IF Colab...</p>
          </div>
          <div className={styles.topics}>
            <div className={styles.maisEdicoes}>
              <h5>TÓPICOS</h5> <hr />
            </div>
            <ul>
              <li>Cases (2 edições)</li>
              <li>Desenvolvimento (10 edições)</li>
              <li>Ideação (6 edições)</li>
              <li>Lançamento (4 edições)</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Seção de Projetos */}
      <section className={styles.projects}>
      <div className={styles.maisEdicoes}>
          <h5>PROJETOS</h5> <hr />
        </div>
        <div className={styles.projectContainerWrapper}>
          <button className={styles.scrollButton} onClick={() => scrollProjects('left')}>
            <FaArrowLeft />
          </button>
          <div className={styles.projectContainer} ref={projectContainerRef}>
            {visibleProjectsList.map(project => (
              <Project key={project.id} project={project} />
            ))}
          </div>
          <button className={styles.scrollButton} onClick={() => scrollProjects('right')}>
            <FaArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;

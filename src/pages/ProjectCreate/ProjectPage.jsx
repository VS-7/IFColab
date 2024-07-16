import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from '../PublicationCreate/PublicationPage.module.css';
import { useAuthValue } from '../../../context/AuthContext';
import Modal from '../../components/Authentication/Modal';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthValue();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        console.error('Invalid projectId');
        return;
      }

      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const renderSection = (section) => {
    switch (section.type) {
      case 'title':
        return <h1 className={styles.titulo}>{section.content.title}</h1>;
      case 'text':
        return <p className={styles.paragrafo}>{section.content.text}</p>;
      case 'video':
        return (
          <div className={styles.videoSection}>
            <iframe
              width="560"
              height="315"
              src={section.content.url.replace('watch?v=', 'embed/')}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={section.id}
            ></iframe>
          </div>
        );
      case 'link':
        return (
          <div className={styles.linkSection}>
            <a href={section.content.url} target="_blank" rel="noopener noreferrer">
              {section.content.url}
            </a>
          </div>
        );
      case 'image':
        return (
          <div className={styles.imageSection}>
            <img src={section.content.url} alt="project" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleEdit = () => {
    navigate(`/editar-projeto/${projectId}`, { state: { project } });
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      alert('Projeto excluído com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      alert('Erro ao excluir projeto!');
    }
  };

  return (
    <div className={styles.projectPage}>
      <img src={project.coverImageUrl} alt="Capa do projeto" className={styles.coverImage}></img>
      <div className={styles.projectPageContainer}>
        {project.author && <p className={styles.author}><img src={user.photoURL} alt="user" className={styles.user}/>Publicado por {project.author}</p>}
        {project.createdAt && (
          <p className={styles.date}>{project.createdAt.toDate().toLocaleDateString()}</p>
        )}
        {project.sections.map((section) => (
          <div key={section.id} className={styles.section}>
            {renderSection(section)}
          </div>
        ))}
        {user.uid === project.uid && (
          <div className={styles.actions}>
            <button onClick={handleEdit} className={styles.buttons}>Editar</button>
            <button onClick={() => setIsModalOpen(true)} className={styles.buttonRemove}>Excluir</button>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Confirmação de Exclusão</h2>
        <p>Tem certeza de que deseja excluir este projeto?</p>
        <div className={styles.actions}>
            <button onClick={handleDelete} className={styles.buttonRemove}>Confirmar</button>
            <button onClick={() => setIsModalOpen(false)} className={styles.buttons}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './PublicationPage.module.css';
import { useAuthValue } from '../../../context/AuthContext';
import Modal from '../../components/Authentication/Modal';

const PublicationPage = () => {
  const { publicationId } = useParams();
  const [publication, setPublication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthValue();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublication = async () => {
      if (!publicationId) {
        console.error('Invalid publicationId');
        return;
      }

      try {
        const docRef = doc(db, 'publications', publicationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPublication({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching publication:', error);
      }
    };

    fetchPublication();
  }, [publicationId]);

  if (!publication) {
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
            <img src={section.content.url} alt="publication" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleEdit = () => {
    navigate(`/editar-publicacao/${publicationId}`, { state: { publication } });
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'publications', publicationId));
      alert('Publicação excluída com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir publicação:', error);
      alert('Erro ao excluir publicação!');
    }
  };

  return (
    <div className={styles.publicationPage}>
      <img src={publication.coverImageUrl} alt="Capa da publicação" className={styles.coverImage}></img>
      <div className={styles.publicationPageContainer}>
      {publication.author && <p className={styles.author}><img src={user.photoURL} alt="user" className={styles.user}/>Publicado por {publication.author}</p>}
      {publication.createdAt && (
        <p className={styles.date}>{publication.createdAt.toDate().toLocaleDateString()}</p>
      )}
      {publication.sections.map((section) => (
        <div key={section.id} className={styles.section}>
          {renderSection(section)}
        </div>
      ))}
      {user.uid === publication.uid && (
        <div className={styles.actions}>
          <button onClick={handleEdit} className={styles.buttons}>Editar</button>
          <button onClick={() => setIsModalOpen(true)} className={styles.buttonRemove}>Excluir</button>
        </div>
      )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Confirmação de Exclusão</h2>
        <p>Tem certeza de que deseja excluir esta publicação?</p>
        <div className={styles.actions}>
            <button onClick={handleDelete} className={styles.buttonRemove}>Confirmar</button>
            <button onClick={() => setIsModalOpen(false)} className={styles.buttons}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default PublicationPage;

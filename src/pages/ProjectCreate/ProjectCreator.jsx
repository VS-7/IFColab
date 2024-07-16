import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SectionList from '../PublicationCreate/SectionList';
import styles from '../PublicationCreate/PublicationCreator.module.css';
import { MdOutlineTitle } from "react-icons/md";
import { FaParagraph, FaVideo, FaRegImage } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import { useAuthValue } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProjectCreator = ({ project }) => {
  const [sections, setSections] = useState(project ? project.sections : []);
  const [title, setTitle] = useState(project ? project.title : '');
  const [description, setDescription] = useState(project ? project.description : '');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const { user } = useAuthValue();
  const navigate = useNavigate();

  const addSection = (type) => {
    const newSection = { id: Date.now(), type, content: {} };
    setSections([...sections, newSection]);
  };

  const updateSectionContent = (id, content) => {
    setSections(sections.map(section => section.id === id ? { ...section, content } : section));
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const uploadCoverImage = async () => {
    if (!coverImageFile) return null;

    const storageRef = ref(storage, `coverImages/${coverImageFile.name}`);
    await uploadBytes(storageRef, coverImageFile);
    return await getDownloadURL(storageRef);
  };

  const saveProject = async () => {
    try {
      const coverImageUrl = await uploadCoverImage();
      if (project) {
        const docRef = doc(db, 'projects', project.id);
        await updateDoc(docRef, {
          title,
          description,
          coverImageUrl: coverImageUrl || project.coverImageUrl,
          sections,
        });
        alert('Projeto atualizado com sucesso!');
        navigate('/')
      } else {
        await addDoc(collection(db, 'projects'), {
          uid: user.uid,
          title,
          description,
          coverImageUrl,
          sections,
          createdAt: new Date(),
          author: user.displayName
        });
        alert('Projeto criado com sucesso!');
        navigate('/')
      }
    } catch (error) {
      console.error('Erro ao salvar o projeto: ', error);
      alert('Erro ao salvar o projeto!');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{project ? 'Editar Projeto' : 'O que você vai criar hoje?'}</h2>
          <div className={styles.toolbar}>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('title')}><MdOutlineTitle size="30px"/></button>
              <label>Adicionar Título</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('text')}><FaParagraph size="30px"/></button>
              <label>Adicionar Parágrafo</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('image')}><FaRegImage size="30px"/></button>
              <label>Adicionar Imagem</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('video')}><FaVideo size="30px"/></button>
              <label>Adicionar Vídeo</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('link')}><FaLink size="30px"/></button>
              <label>Adicionar Link</label>
            </div>
          </div>
        </div>
        <div className={styles.editor}>
          <div className={styles.leftColumn}>
            <h3>Seu projeto</h3>
            <SectionList sections={sections} setSections={setSections} updateSectionContent={updateSectionContent} />
          </div>
          <div className={styles.rightColumn}>
            <h3>Imagem de Capa</h3>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleCoverImageChange} 
            />
            <h3>Título</h3>
            <input 
              type="text" 
              placeholder="Escreva o título do seu projeto..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <h3>Descrição</h3>
            <textarea 
              placeholder="Escreva a descrição para seu projeto..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
            
          </div>
        </div>
        <button onClick={saveProject} className={styles.saveButton}>
          {project ? 'Atualizar Projeto' : 'Salvar Projeto'}
        </button>
      </div>
    </DndProvider>
  );
};

export default ProjectCreator;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';
import { useAuthValue } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { IoPersonAddOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { FiHome, FiLogIn, FiSearch } from 'react-icons/fi';
import { MdOutlineEmail } from "react-icons/md";
import Modal from './Authentication/Modal';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import DocumentSearch from './Authentication/DocumentSearch';
import { SlOptionsVertical } from "react-icons/sl";

const Navbar = () => {
  const { user } = useAuthValue();
  const { logout } = useAuthentication();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenTwo, setIsDropdownOpenTwo] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalMessage('');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdownTwo = () => {
    setIsDropdownOpenTwo(!isDropdownOpenTwo);
  };

  const handlePetianoAreaClick = () => {
    if (user && user.role === 'petiano') {
      navigate('/area-colaborador');
    } else {
      setModalMessage('Você não tem permissão para acessar a Área do Petiano. Esta área é reservada apenas para petianos. Se você acha que isso é um erro, por favor, entre em contato com o suporte.');
      setIsModalOpen(true);
    }
  };

  return (
    <>
      
      <div className={styles.navbarContainer}>
      <div className={styles.header}>
        <h4>Plataforma de Estudos, Cursos e Informações! Entre no <a >discord.</a></h4>
      </div>
        <nav className={styles.navbar}>
          <ul className={styles.links_list}>
            <img src="https://firebasestorage.googleapis.com/v0/b/ifmobile-dd43d.appspot.com/o/logo_borda.png?alt=media&token=d174632d-0979-4d6f-8dc5-53ea28fe81ce" alt="logo" className={styles.logo} />
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/sobre" className={({ isActive }) => (isActive ? styles.active : '')}>
                SOBRE
              </NavLink>
            </li>

            <li>
              {user ? (
                <>
                  <ul className={styles.links_list}>
                    <li>
                      <NavLink to="/cursos" className={({ isActive }) => (isActive ? styles.active : '')}>
                        CURSOS
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : '')}>
                        DASHBOARD
                      </NavLink>
                    </li>
                    <li className={styles.dropdown}>
                      <button onClick={toggleDropdown} className={styles.dropdownButton}>
                        PUBLICAR
                      </button>
                      {isDropdownOpen && (
                        <div className={styles.dropdownContent}>
                          <NavLink to="/criar-publicacao" className={styles.dropdownItem}>
                            Criar uma Publicação
                          </NavLink>
                          <NavLink to="/criar-curso" className={styles.dropdownItem}>
                            Criar um Curso
                          </NavLink>
                          <NavLink to="/criar-projeto" className={styles.dropdownItem}>
                            Criar um Projeto
                          </NavLink>
                        </div>
                      )}
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  {/* Other non-authenticated user links can go here */}
                </>
              )}
            </li>
          </ul>
          <div className={styles.brand}>
            <ul className={styles.links_list}>
              <li className={styles.dropdown}>
                <button onClick={toggleDropdownTwo} className={styles.button}>
                  <SlOptionsVertical className={styles.icon} />
                </button>
                {isDropdownOpenTwo && (
                  <div className={styles.dropdownContent}>
                    <button onClick={handlePetianoAreaClick} className={styles.dropdownItem}>
                      Área do Colaborador
                    </button>
                  </div>
                )}
              </li>
              <li>
                <button onClick={() => openModal(<DocumentSearch onClose={closeModal} />)} className={styles.button}>
                  <FiSearch className={styles.icon} />
                </button>
              </li>
              <li>
                {user ? (
                  <button onClick={logout} className={styles.logoutButton}>
                    SAIR
                  </button>
                ) : (
                  <>
                    <button onClick={() => openModal(<Login onClose={closeModal} />)} className={styles.button}>
                      ENTRAR
                    </button>
                    <button onClick={() => openModal(<Register onClose={closeModal} />)} className={styles.register}>
                      <MdOutlineEmail className={styles.icon} />
                      INSCREVER-SE
                    </button>
                  </>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalMessage ? <p>{modalMessage}</p> : modalContent}
      </Modal>
    </>
  );
};

export default Navbar;

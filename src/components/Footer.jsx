import React from 'react';
import styles from './Footer.module.css';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.links_section}>
          <img src="https://firebasestorage.googleapis.com/v0/b/ifmobile-dd43d.appspot.com/o/logo_borda.png?alt=media&token=d174632d-0979-4d6f-8dc5-53ea28fe81ce" alt="logo" className={styles.logoImg} />
          <ul className={styles.ul}>
            <li><NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>HOME</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => (isActive ? styles.active : '')}>SOBRE</NavLink></li>
            <li><NavLink to="/documentation" className={({ isActive }) => (isActive ? styles.active : '')}>DOCUMENTAÇÃO</NavLink></li>
          </ul>
        </div>
        <div className={styles.social_section}>
          <button className={styles.iconButton}>
            <FaTwitter />
          </button>
          <button className={styles.iconButton}>
            <FaDiscord />
          </button>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2024 Copyright Grupo de Estudos IF Colab™</p>
        <div>
          <NavLink to="/terms-conditions" className={styles.link}>Termos & Condições</NavLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

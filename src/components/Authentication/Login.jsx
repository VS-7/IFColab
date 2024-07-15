import React, { useState } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';
import { FaGoogle } from "react-icons/fa";
import styles from './Modal.module.css'
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
  const { login, loginWithGoogle, error, loading } = useAuthentication();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = (id) => {
    navigate('/resetPassword');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Insira seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Insira sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? 'Carregando...' : 'Entrar'}
      </button>
      {error && <p>{error}</p>}
      <button type="button" onClick={handleGoogleLogin} disabled={loading} className={styles.googleButton}>
      <FaGoogle />
        {loading ? 'Carregando...' : 'Entrar com Google'}
      </button>
      <p>Esqueceu a senha?<a onClick={handleResetPassword}> clique aqui</a></p>
    </form>
  );
};

export default Login;

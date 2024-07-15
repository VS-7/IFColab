import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import styles from './ParticipantList.module.css';

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const participantsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setParticipants(participantsData);
      } catch (err) {
        setError('Erro ao carregar os participantes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.id === userId ? { ...participant, role: newRole } : participant
        )
      );
    } catch (err) {
      setError('Erro ao atualizar o cargo.');
      console.error(err);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.participantList}>
      {participants.map((participant) => (
        <div key={participant.id} className={styles.participant}>
          <div className={styles.participantInfo}>
            <p>{participant.displayName}</p>
            <p>{participant.email}</p>
            <p>{participant.role}</p>
          </div>
          <div className={styles.actions}>
            <select
              value={participant.role}
              onChange={(e) => handleRoleChange(participant.id, e.target.value)}
            >
              <option value="usuario">Usuário</option>
              <option value="petiano">Petiano</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantList;

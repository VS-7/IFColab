// src/components/CharacterCard/CharacterCard.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { tasks as initialTasks } from './tasks/tasks';
import styles from './CharacterCard.module.css';

const CharacterCard = ({ userId }) => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    const fetchCharacterData = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setLevel(data.level);
        setXp(data.xp);
        setTasks(data.tasks || initialTasks);
      }
    };

    fetchCharacterData();
  }, [userId]);

  const handleTaskCompletion = async (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    const completedTask = updatedTasks.find(task => task.id === taskId);
    const newXp = xp + completedTask.xp;
    const newLevel = Math.floor(newXp / 100) + 1;

    setTasks(updatedTasks);
    setXp(newXp);
    setLevel(newLevel);

    // Atualizar o Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      xp: newXp,
      level: newLevel,
      tasks: updatedTasks,
    });
  };

  return (
    <div className={styles.card}>
      <h2>Seu Personagem</h2>
      <p>Nível: {level}</p>
      <p>XP: {xp}</p>
      <h3>Tarefas</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.description}</span>
            <button 
              onClick={() => handleTaskCompletion(task.id)} 
              disabled={task.completed}
            >
              {task.completed ? 'Completada' : 'Completar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterCard;

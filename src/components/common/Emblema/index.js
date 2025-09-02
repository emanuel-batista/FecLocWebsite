// src/components/common/Emblema/index.js

import React from 'react';
import styles from './Emblema.module.css';

/**
 * Componente que renderiza um emblema redondo com o nome do curso.
 * @param {{ 
 * tipo: 'gold' | 'silver';
 * nomeCurso: string;
 * }} props
 */
function Emblema({ tipo, nomeCurso }) {
  const emblemaClasse = `${styles.emblema} ${styles[tipo]}`;

  return (
    <div className={emblemaClasse}>
      <span className={styles.textoEmblema}>{nomeCurso}</span>
    </div>
  );
}

export default Emblema;
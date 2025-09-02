// src/webApp/HomeAlternative/index.js

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import PlaceCard from 'components/HomeAlternative/PlaceCard';
import styles from "./hAlternative.module.css";
import SearchBar from "components/HomeAlternative/SearchBar";
import { CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function HomeAlternative() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const db = getFirestore();
        const unidadesCollection = collection(db, "unidades");
        // Cria uma query para ordenar as unidades por nome
        const q = query(unidadesCollection, orderBy("nome"));
        
        const querySnapshot = await getDocs(q);
        const unidadesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUnidades(unidadesList);
      } catch (error) {
        console.error("Erro ao buscar unidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnidades();
  }, []);

  return (
    <div id={styles.hAlternativeContainer}>
      <SearchBar />
      <h2 className={styles.h2}>Unidades</h2>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className={styles.hAlternative}>
          {unidades.map(unidade => (
            <Link to={`/unidade/${unidade.id}`} key={unidade.id} className={styles.placeCardLink}>
              <PlaceCard 
                backgroundImage={unidade.fotoUrl} 
                standName={unidade.nome} 
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeAlternative;
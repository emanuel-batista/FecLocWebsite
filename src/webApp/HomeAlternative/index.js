// src/webApp/HomeAlternative/index.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import PlaceCard from 'components/HomeAlternative/PlaceCard';
import CursoCard from 'components/HomeAlternative/CursoCard';
import styles from "./hAlternative.module.css";
import SearchBar from "components/HomeAlternative/SearchBar";
import PremioBanner from 'components/HomeAlternative/PremioBanner'; // <-- NOVO IMPORT
import { CircularProgress, Box, Typography } from '@mui/material';

function HomeAlternative() {
  const [unidades, setUnidades] = useState([]);
  const [allCursos, setAllCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const unidadesQuery = query(collection(db, "unidades"), orderBy("nome"));
        const unidadesSnapshot = await getDocs(unidadesQuery);
        setUnidades(unidadesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const cursosSnapshot = await getDocs(collection(db, "cursos"));
        setAllCursos(cursosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value === '') {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim() === '') {
      setIsSearching(false);
      return;
    }
    const results = allCursos.filter(curso =>
      curso.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  const renderContent = () => {
    if (loading) {
      return <Box display="flex" justifyContent="center" sx={{ my: 4 }}><CircularProgress /></Box>;
    }

    if (isSearching) {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" className={styles.h2}>Resultados para "{searchTerm}"</Typography>
          {searchResults.length > 0 ? (
            searchResults.map(curso => <CursoCard key={curso.id} curso={curso} />)
          ) : (
            <Typography sx={{ textAlign: 'center', mt: 4 }}>Nenhum curso encontrado.</Typography>
          )}
        </Box>
      );
    }
    
    return (
      <>
        <h2 className={styles.h2}>Unidades</h2>
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
      </>
    );
  };

  return (
    <div id={styles.hAlternativeContainer}>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      
      {/* --- BANNER ADICIONADO AQUI --- */}
      <PremioBanner />

      {renderContent()}
    </div>
  );
}

export default HomeAlternative;
// src/pages/LandingPage.js

import React from 'react';
import HomePage from './HomePage/HomePage';
import SobrePage from './Sobre/SobrePage';
import ContatoPage from './Contato/ContatoPage';

function LandingPage() {
  return (
    <div>
      <HomePage />
      <SobrePage />
      <ContatoPage />
    </div>
  );
}

export default LandingPage;
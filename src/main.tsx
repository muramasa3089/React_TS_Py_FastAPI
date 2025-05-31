import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import JankenPage from './pages/RSP_page';
import GameOver from './pages/GameOver';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<JankenPage />} />
            <Route path="/gameover" element={<GameOver />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import SingleTake from './pages/SingleTake';

// Layout
import Layout from './components/Layout';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/take/:id" element={<SingleTake />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
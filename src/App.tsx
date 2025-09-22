import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetail from './pages/VenueDetail';
import Chat from './pages/Chat';
import ListVenue from './pages/ListVenue';
import UserVenues from './pages/UserVenues';
import Admin from './pages/Admin';
import SemanticSearch from './pages/SemanticSearch';
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/list-venue" element={<ListVenue />} />
          <Route path="/my-venues" element={<UserVenues />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/semantic-search" element={<SemanticSearch />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    
  );
}

export default App;
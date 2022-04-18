import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddItem from './components/AddItem/AddItem';
import List from './components/List/List';
import Welcome from './components/Welcome/Welcome';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/list/:token" element={<List />} />
        <Route path="/addItem/:token" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

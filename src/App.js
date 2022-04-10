import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddItem from './components/AddItem/AddItem';
import List from './components/List/List';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/addItem" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

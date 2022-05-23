import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const BaseStyledApplication = () => (
  <div className="min-h-screen dark:bg-primary">
    <App />
  </div>
);

ReactDOM.render(<BaseStyledApplication />, document.getElementById('root'));

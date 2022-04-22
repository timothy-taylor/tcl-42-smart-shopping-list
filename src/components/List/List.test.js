import React from 'react';
import ReactDOM from 'react-dom';
import List from './List';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <List />
    </BrowserRouter>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});

// write a test that 'when a user inputs a three word token, a list renders to the browser'

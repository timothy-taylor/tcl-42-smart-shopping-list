import React from 'react';
import ReactDOM from 'react-dom';
import AddItem, { normalizeInput } from './AddItem';
import { BrowserRouter } from 'react-router-dom';

describe('normalizeInput', () => {
  const sanitizedStr = 'some nice food items';

  it('runs with a reasonable input', () => {
    expect(normalizeInput(sanitizedStr)).toEqual(sanitizedStr);
  });

  it('runs with some unreasonable input', () => {
    const str = 'some! ?nice... food items';
    expect(normalizeInput(str)).toEqual(sanitizedStr);
  });

  it('runs with a really unreasonable input', () => {
    const str = '!!!some n@#$^ic$%#@#$e fo()od ?><,./items...';
    expect(normalizeInput(str)).toEqual(sanitizedStr);
  });
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <AddItem />
    </BrowserRouter>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});

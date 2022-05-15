import React from 'react';
import ReactDOM from 'react-dom';
import AddItem from './AddItem';
import { BrowserRouter } from 'react-router-dom';
import { normalize } from '../../lib/util'

describe('normalize', () => {
  const sanitizedStr = 'some nice food items';

  it('runs with a reasonable input', () => {
    expect(normalize(sanitizedStr)).toEqual(sanitizedStr);
  });

  it('runs with some unreasonable input', () => {
    const str = 'some! ?nice... food items';
    expect(normalize(str)).toEqual(sanitizedStr);
  });

  it('runs with a really unreasonable input', () => {
    const str = '!!!some n@#$^ic$%#@#$e fo()od ?><,./items...';
    expect(normalize(str)).toEqual(sanitizedStr);
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

import React from 'react';
import ReactDOM from 'react-dom';
import List from './List';
import { BrowserRouter } from 'react-router-dom';
import { isLessThan24HoursOld } from '../../hooks/useSnapshot';

describe('isLessThan24HoursOld', () => {
  const oneHourInMilliSec = 3600000;

  it('returns true if the timestamp is less than 24 hours different than the current time', () => {
    const timestamp = Date.now() - oneHourInMilliSec;
    expect(isLessThan24HoursOld(timestamp)).toEqual(true);
  });

  it('returns false if the timestamp is more than 24 hours different than the current time', () => {
    const timestamp = Date.now() - oneHourInMilliSec * 25;
    expect(isLessThan24HoursOld(timestamp)).toEqual(false);
  });

  it('returns false if the timestamp is undefined', () => {
    const timestamp = undefined;
    expect(isLessThan24HoursOld(timestamp)).toEqual(false);
  });

  it('returns false if the timestamp is null', () => {
    const timestamp = null;
    expect(isLessThan24HoursOld(timestamp)).toEqual(false);
  });
});

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

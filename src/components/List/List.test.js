import React from 'react';
import ReactDOM from 'react-dom';
import List, { timeDifference } from './List';
import { BrowserRouter } from 'react-router-dom';

describe('timeDifference', () => {
  const oneHourInMilliSec = 3600000;

  it('runs timeDifference and returns true if the timestamp is less than 24 hours different than the current time', () => {
    const timestamp = Date.now() - oneHourInMilliSec;
    expect(timeDifference(timestamp)).toEqual(true);
  });

  it('runs timeDifference and returns false if the timestamp is more than 24 hours different than the current time', () => {
    const timestamp = Date.now() - oneHourInMilliSec * 25;
    expect(timeDifference(timestamp)).toEqual(false);
  });

  it('runs timeDifference and returns false if the timestamp is undefined', () => {
    const timestamp = undefined;
    expect(timeDifference(timestamp)).toEqual(false);
  });

  it('runs timeDifference and returns false if the timestamp is null', () => {
    const timestamp = null;
    expect(timeDifference(timestamp)).toEqual(false);
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

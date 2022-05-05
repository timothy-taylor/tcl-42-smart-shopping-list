import React from 'react';
import ReactDOM from 'react-dom';
import List, { isLessThan24HoursOld, daysSincePurchase, DAY_IN_MILLISEC } from './List';
import { BrowserRouter } from 'react-router-dom';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

describe('calculateEstimate', () => {
  it('runs calculateEstimate with less than two purchases', () => {
    // parameters:
    // previousEstimate(number)
    // daysSinceLastPurchase(number)
    // totalPurchases(number)
    // return: a number in days
    const returnValue = calculateEstimate(7, 5, 1);
    expect(returnValue).toEqual(5);
  });
});

describe('daysSincePurchase', () => {
  it('runs with valid input', () => {
    const numDays = 3;
    const dateSinceLastPurchased = Date.now() - DAY_IN_MILLISEC * numDays;
    const dateCreated = Date.now() - DAY_IN_MILLISEC * 7;
    expect(daysSincePurchase(dateSinceLastPurchased,dateCreated)).toEqual(numDays);
  });

  it('runs with undefined input', () => {
    const numDays = 5;
    const dateCreated = Date.now() - DAY_IN_MILLISEC * numDays;
    expect(daysSincePurchase(undefined,dateCreated)).toEqual(numDays);
  });
});

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

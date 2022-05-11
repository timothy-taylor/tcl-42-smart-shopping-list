import React from 'react';
import ReactDOM from 'react-dom';
import ListItem from './ListItem';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { daysSincePurchase } from './ListItem';
import { DAY_IN_MILLISEC } from '../../lib/util';

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
    expect(daysSincePurchase(dateSinceLastPurchased, dateCreated)).toEqual(
      numDays,
    );
  });

  it('runs with undefined input', () => {
    const numDays = 5;
    const dateCreated = Date.now() - DAY_IN_MILLISEC * numDays;
    expect(daysSincePurchase(undefined, dateCreated)).toEqual(numDays);
  });
});

it('renders without crashing', () => {
  const item = { item: 'water', checked: true };
  const div = document.createElement('div');
  ReactDOM.render(<ListItem commodity={item} token={'random string'} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

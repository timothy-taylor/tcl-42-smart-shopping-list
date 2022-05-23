import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Welcome from './Welcome';
import { render } from '@testing-library/react';

describe('Welcome', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('checks localStorage for token on render', () => {
    Object.getPrototypeOf(localStorage).getItem = jest.fn();
    render(<Welcome />);
    expect(localStorage.getItem).toHaveBeenCalled();
  });
});

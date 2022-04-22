import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Welcome from './Welcome';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  it('clicking the button calls setToken which triggers setItem useEffect', () => {
    Object.getPrototypeOf(localStorage).getItem = jest.fn();
    Object.getPrototypeOf(localStorage).setItem = jest.fn();

    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: 'Create new list' });
    userEvent.click(button);

    expect(localStorage.setItem).toHaveBeenCalled();
  });

/*
  it("user tries to input a token that doesn't exist", () => {
    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>,
    );

    const inputTextBox = screen.getByLabelText('Share token');
    userEvent.type(inputTextBox, 'aldnfalhjtowaq');
    const button = screen.getByRole('button', {
      name: 'Join an existing list',
    });
    userEvent.click(button);

    expect(screen.getByText('This token is not valid')).toBeInTheDocument();
  });

  it('user inputs a three word token that does exist', () => {
    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>,
    );

    const inputTextBox = screen.getByPlaceholderText('three word token');
    userEvent.type(inputTextBox, 'mccoy thule morel');
    const button = screen.getByRole('button', {
      name: 'Join an existing list',
    });
    userEvent.click(button);

    expect(
      screen.queryByText('This token is not valid'),
    ).not.toBeInTheDocument();
  });
*/
});

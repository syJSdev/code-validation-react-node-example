import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, cleanup } from '@testing-library/react';

import App from '../App.jsx';

describe('Component: App', () => {
  let component;
  let inputComponent;
  let submitButtonComponent;
  let history;

  beforeEach(() => {
    history = createBrowserHistory();
    history.push('/validation');

    const { container, getByTestId } = render(
      <React.StrictMode>
        <Router history={history}>
          <App />
        </Router>
      </React.StrictMode>
    );

    component = container.firstChild;
    inputComponent = getByTestId('0');
    submitButtonComponent = container.querySelector('div.card form button[type=submit]');
  });

  afterEach(cleanup);

  it('check if component initialized', () => {
    expect(history.location.pathname).toBe('/validation');
    expect(component).toBeTruthy();
    expect(inputComponent).toBeTruthy();
    expect(submitButtonComponent).toBeTruthy();
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('container');
  });
});

import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import VerificationBox from 'components/VerficationBox';
import { CODE_LENGTH } from 'constants/values';
import { checkCode } from 'utils/api';

jest.mock('utils/api');

describe('Component: VerificationBox', () => {
  let component;
  let inputComponents;
  let messageComponent;
  let submitButtonComponent;
  let onSuccess;

  beforeEach(() => {
    onSuccess = jest.fn();
    const { container } = render(<VerificationBox onSuccess={onSuccess} />);

    component = container.firstChild;
    inputComponents = container.querySelectorAll('div.card div.form-group input.form-control');
    submitButtonComponent = container.querySelector('div.card form button[type=submit]');
    messageComponent = container.querySelector('div.card div.form-group div.invalid-feedback');
  });

  afterEach(cleanup);

  it('check if component initialized', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('card');
    expect(messageComponent).not.toBeVisible();
    expect(submitButtonComponent).toBeTruthy();
    expect(inputComponents.length).toBe(CODE_LENGTH);
    expect(onSuccess).toHaveBeenCalledTimes(0);
  });

  it('invalid code: length', () => {
    const value = '1'.repeat(CODE_LENGTH - 1);

    fireEvent.input(inputComponents[0], { target: { value } });
    fireEvent.change(inputComponents[0], { target: { value } });

    expect(messageComponent).not.toBeVisible();
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      expect(inputComponents[i]).not.toHaveClass('is-invalid');
    }

    fireEvent.click(submitButtonComponent);

    expect(messageComponent).toBeVisible();
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      let expc = expect(inputComponents[i]);
      if (i !== CODE_LENGTH - 1) {
        expc = expc.not;
      }
      expc.toHaveClass('is-invalid');
    }
  });

  it('invalid code: invalid character', () => {
    const value = `${'1'.repeat(CODE_LENGTH - 1)}e`;

    fireEvent.input(inputComponents[0], { target: { value } });
    fireEvent.change(inputComponents[0], { target: { value } });

    expect(inputComponents[CODE_LENGTH - 1]).toHaveClass('is-invalid');
    expect(messageComponent).not.toBeVisible();

    fireEvent.click(submitButtonComponent);

    expect(inputComponents[CODE_LENGTH - 1]).toHaveClass('is-invalid');
    expect(messageComponent).toBeVisible();
  });

  it('invalid code: rejected', async () => {
    const value = `${'1'.repeat(CODE_LENGTH - 1)}7`;

    fireEvent.input(inputComponents[0], { target: { value } });
    fireEvent.change(inputComponents[0], { target: { value } });

    expect(messageComponent).not.toBeVisible();

    checkCode.mockRejectedValueOnce({ statusCode: 400, response: { data: { errorMsg: 'Invalid Code' } } });
    fireEvent.click(submitButtonComponent);
    await waitFor(() => expect(checkCode).toHaveBeenCalledTimes(1));

    expect(messageComponent).toBeVisible();
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      expect(inputComponents[i]).toHaveClass('is-invalid');
    }
  });

  it('valid code', async () => {
    const value = '1'.repeat(CODE_LENGTH);
    fireEvent.input(inputComponents[0], { target: { value } });
    fireEvent.change(inputComponents[0], { target: { value } });

    expect(messageComponent).not.toBeVisible();
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      expect(inputComponents[i]).not.toHaveClass('is-invalid');
    }

    checkCode.mockResolvedValueOnce({ statusCode: 200 });
    fireEvent.click(submitButtonComponent);
    await waitFor(() => expect(checkCode).toHaveBeenCalledTimes(1));

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(messageComponent).not.toBeVisible();
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      expect(inputComponents[i]).not.toHaveClass('is-invalid');
    }
  });
});

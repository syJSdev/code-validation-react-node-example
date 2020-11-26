import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import DigitInput from 'components/DigitInput';

describe('Component: DigitInput', () => {
  const index = String(0);
  const initValue = '1';
  let component;
  let changeFocus;
  let onChange;
  let ref;

  beforeEach(() => {
    changeFocus = jest.fn();
    onChange = jest.fn();
    ref = jest.fn();

    const { container } = render(
      <DigitInput
        index={index}
        inputRef={ref}
        value={initValue}
        onChange={onChange}
        changeFocus={changeFocus}
        maxLength={6}
        autoFocus
        isInvalid={false}
      />
    );

    component = container.firstChild;
  });

  afterEach(cleanup);

  it('check if component initialized', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('form-control');
    expect(component).toHaveValue(initValue);
    expect(component).not.toHaveClass('is-invalid');
    expect(ref).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('input check', () => {
    const value = '1';
    fireEvent.input(component, { target: { value } });
    fireEvent.change(component, { target: { value } });
    expect(changeFocus).toHaveBeenCalledTimes(0);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

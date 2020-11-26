import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import CodeInput from 'components/CodeInput';
import { RIGHT_ARROW_KEY, BACKSPACE_KEY, LEFT_ARROW_KEY, EMPTY_CHAR, CODE_LENGTH } from 'constants/values';

describe('Component: CodeInput - input check', () => {
  let component;
  let inputComponents;
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();

    const { container } = render(<CodeInput length={CODE_LENGTH} value="" onChange={onChange} />);

    component = container.firstChild;
    inputComponents = container.querySelectorAll('input.form-control');
  });

  afterEach(cleanup);

  it('check if component initialized', () => {
    const expectValue = EMPTY_CHAR.repeat(CODE_LENGTH);
    expect(component).toBeTruthy();
    expect(component).toBeInTheDocument();
    expect(inputComponents.length).toBe(CODE_LENGTH);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(expectValue));
  });

  // paste from clipboard, rapid input, invalid check
  it('input: 1a3456789', () => {
    const value = '1a3456789';
    const expectValue = value.slice(0, CODE_LENGTH).padEnd(CODE_LENGTH, EMPTY_CHAR);
    fireEvent.input(inputComponents[0], { target: { value } });
    fireEvent.change(inputComponents[0], { target: { value } });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(2, expect.stringMatching(expectValue));
    expect(inputComponents[CODE_LENGTH - 1]).toHaveFocus();
  });
});

describe('Component: CodeInput - keydown check', () => {
  let component;
  let inputComponents;
  let onChange;
  const initValue = '123456';

  beforeEach(() => {
    onChange = jest.fn();

    const { container } = render(<CodeInput length={6} value={initValue} onChange={onChange} />);

    component = container.firstChild;
    inputComponents = container.querySelectorAll('input.form-control');
  });

  afterEach(cleanup);

  it('check if component initialized', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInTheDocument();
    expect(inputComponents.length).toBe(CODE_LENGTH);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(initValue));
  });

  it('Backspace', () => {
    const expectValue = '1-3456';
    const key = BACKSPACE_KEY;
    fireEvent.keyDown(inputComponents[1], { keyCode: key });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(2, expect.stringMatching(expectValue));
    expect(inputComponents[1]).not.toHaveFocus();
    expect(inputComponents[0]).toHaveFocus();
  });

  it('ArrowRight', () => {
    const key = RIGHT_ARROW_KEY;
    fireEvent.keyDown(inputComponents[1], { keyCode: key });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(inputComponents[1]).not.toHaveFocus();
    expect(inputComponents[2]).toHaveFocus();
  });

  it('ArrowLeft', () => {
    const key = LEFT_ARROW_KEY;
    fireEvent.keyDown(inputComponents[1], { keyCode: key });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(inputComponents[1]).not.toHaveFocus();
    expect(inputComponents[0]).toHaveFocus();
  });

  it('EMPTY_CHAR', () => {
    const key = EMPTY_CHAR;
    fireEvent.keyDown(inputComponents[0], { keyCode: key });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(inputComponents[0]).toHaveFocus();
  });
});

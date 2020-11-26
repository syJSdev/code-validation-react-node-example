import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import { KEY_CODE_BLOCK_LIST, BACKSPACE_KEY, LEFT_ARROW_KEY, RIGHT_ARROW_KEY } from 'constants/values';

const validateCode = (code) => {
  if (code === undefined || code === null || code === '') return false;
  return /^\d$/.test(code);
};

const StyledFormControl = styled(Form.Control)`
  &&& {
    font-weight: bold;
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    height: calc(1.5em + 1rem + 2px);
    width: calc(1.5em + 1rem + 2px);
  }
  &.is-invalid {
    background-image: none;
  }
`;

const DigitInput = React.memo(
  ({ index, inputRef, value, onChange, changeFocus, maxLength, autoFocus, isInvalid }) => {
    const [error, setError] = useState(false);
    const touched = useRef(false);

    // validation
    const validate = useCallback(
      (character) => {
        if (!touched) return;
        if (touched.current === false && !value) return;

        setError(!validateCode(character));
      },
      [value]
    );

    useEffect(() => {
      validate(value);
    }, [value, validate]);

    useEffect(() => {
      setError(isInvalid);
    }, [isInvalid]);

    // the event handlers
    const handleFocus = useCallback((event) => {
      event.target.select();

      if (!touched) return;
      touched.current = true;
    }, []);

    const handleBlur = useCallback(
      (event) => {
        validate(value);
      },
      [validate, value]
    );

    const handleKeyDown = useCallback(
      (event) => {
        const target = Number(event.target.id);
        if (KEY_CODE_BLOCK_LIST.includes(event.keyCode)) {
          event.preventDefault();
          return;
        }

        switch (event.keyCode) {
          case BACKSPACE_KEY:
            event.preventDefault();
            changeFocus(target - 1, event, { clear: true });
            break;

          case LEFT_ARROW_KEY:
            event.preventDefault();
            changeFocus(target - 1, event);
            break;

          case RIGHT_ARROW_KEY:
            event.preventDefault();
            changeFocus(target + 1, event);
            break;

          default:
            break;
        }
      },
      [changeFocus]
    );

    return (
      <StyledFormControl
        ref={inputRef}
        id={index}
        autoFocus={autoFocus}
        name={`code-${index}`}
        type="text"
        size="lg"
        maxLength={maxLength}
        value={value}
        // onChange event is not fired when input the same digit
        onInput={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        isInvalid={error}
      />
    );
  }
);

DigitInput.defaultProps = {
  value: '',
  inputRef: undefined,
  autoFocus: false,
  isInvalid: false,
  maxLength: 1,
};

DigitInput.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  changeFocus: PropTypes.func.isRequired,
  isInvalid: PropTypes.bool,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
};

export default DigitInput;

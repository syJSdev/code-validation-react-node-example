import React, { useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { EMPTY_CHAR } from 'constants/values';
import DigitInput from './DigitInput';

const getString = (val) => {
  let ret = '';

  if (typeof val === 'string') {
    ret = val;
  } else if (typeof val === 'number') {
    ret = val.toString();
  }

  return ret;
};

const CodeInput = React.memo(({ length, onChange, value, error }) => {
  const codeLocal = useRef(value);
  const code = useMemo(() => getString(value).slice(0, length).padEnd(length, EMPTY_CHAR), [length, value]);
  const inputRefs = useMemo(
    () =>
      Array(length)
        .fill(null)
        .map(() => React.createRef()),
    [length]
  );

  // change focus
  const triggerChange = useCallback(
    (id, val, backWhenEmpty) => {
      if (!codeLocal) return;

      let nextIndex;
      const oldValue = getString(codeLocal.current);
      const codes = oldValue.split('');

      if (val.length > 1) {
        nextIndex = val.length + id - 1;
        val.split('').forEach((digit, i) => {
          if (id + i < length) {
            codes[id + i] = digit;
          }
        });
      } else if (val.length > 0) {
        nextIndex = id + 1;
        codes[id] = val;
      } else {
        if (backWhenEmpty) nextIndex = id - 1;
        codes[id] = EMPTY_CHAR;
      }

      if (nextIndex >= 0 && inputRefs[nextIndex] && inputRefs[nextIndex].current) {
        inputRefs[nextIndex].current.focus();
        inputRefs[nextIndex].current.select();
      }

      console.log('prev: ', codeLocal.current);
      codeLocal.current = codes.join('');
      console.log('next: ', codeLocal.current);
      onChange(codeLocal.current);
    },
    [inputRefs, length, onChange]
  );

  // the handler of value input
  const handleChange = useCallback(
    (event) => {
      const index = Number(event.target.id);
      triggerChange(index, event.target.value);
    },
    [triggerChange]
  );

  // change focus
  const changeFocus = useCallback(
    (index, event, options) => {
      if (inputRefs[index] && inputRefs[index].current) {
        inputRefs[index].current.focus();
        inputRefs[index].current.select();
      }

      if (options && options.clear) {
        const clearTaget = Number(event.target.id);
        if (inputRefs[clearTaget] && inputRefs[clearTaget].current) {
          inputRefs[clearTaget].current.value = '';
        }
        triggerChange(clearTaget, '', true);
      }
    },
    [triggerChange, inputRefs]
  );

  return (
    <Form.Group>
      <div className="d-flex align-items-stretch justify-content-center">
        {code &&
          typeof code === 'string' &&
          code.split('').map((c, index) => (
            /* eslint-disable react/no-array-index-key */
            <DigitInput
              key={index}
              autoFocus={index === 0}
              index={index.toString()}
              inputRef={inputRefs[index]}
              value={c === EMPTY_CHAR || !c ? '' : c}
              onChange={handleChange}
              changeFocus={changeFocus}
              isInvalid={!!(error && error.error && error.detail && error.detail[index])}
              maxLength={length - index}
            />
            /* eslint-enable react/no-array-index-key */
          ))}
      </div>
      {error && error.error && error.message && (
        <Form.Control.Feedback className="d-block" type="invalid">
          {error.message}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

CodeInput.defaultProps = {
  value: '',
  error: {
    error: false,
    detail: [],
    message: null,
  },
};

CodeInput.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.shape({
    error: PropTypes.bool,
    detail: PropTypes.arrayOf(PropTypes.string),
    message: PropTypes.string,
  }),
};

export default CodeInput;

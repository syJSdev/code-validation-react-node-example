import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
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

const CodeInput = React.memo(({ length, onChange, value, errors }) => {
  const code = useMemo(() => getString(value).slice(0, length).padEnd(length, EMPTY_CHAR), [length, value]);
  const inputRefs = useMemo(
    () =>
      Array(length)
        .fill(null)
        .map(() => React.createRef()),
    [length]
  );
  const codeLocal = useRef(code);

  useEffect(() => {
    // fire onChange with formated code when component mounted.
    onChange(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // change focus
  const triggerChange = useCallback(
    (id, val, backWhenEmpty) => {
      if (!codeLocal) return;

      let nextIndex;
      const oldValue = getString(codeLocal.current);
      const codes = oldValue.split('');

      if (val.length > 1) {
        if (val.length > length) {
          nextIndex = length + id - 1;
        } else {
          nextIndex = val.length + id - 1;
        }
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

      const prev = codeLocal.current;
      codeLocal.current = codes.join('');
      console.log('prev: ', prev);
      console.log('next: ', codeLocal.current);

      if (prev === codeLocal.current) return;

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
            isInvalid={!!(errors && errors[index])}
            maxLength={length - index}
          />
          /* eslint-enable react/no-array-index-key */
        ))}
    </div>
  );
});

CodeInput.defaultProps = {
  value: '',
  errors: [],
};

CodeInput.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default CodeInput;

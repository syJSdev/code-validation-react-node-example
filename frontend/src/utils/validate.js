import { EMPTY_CHAR } from 'constants/values';

const validate = (code, codeLength) => {
  if (!code)
    return {
      error: true,
      message: 'Code is required',
      detail: Array(codeLength).fill('Required'),
    };
  if (typeof code !== 'string')
    return {
      error: true,
      message: 'Code must be string',
      detail: Array(codeLength).fill('Invalid'),
    };
  const res = code
    .padEnd(codeLength, EMPTY_CHAR)
    .split('')
    .reduce(
      (acc, cur, index) => {
        const detailClone = [...acc.detail];
        if (cur === EMPTY_CHAR) {
          detailClone[index] = 'Required';
          return { ...acc, error: true, detail: detailClone, message: 'Verification Error' };
        }
        if (!/^\d$/.test(cur)) {
          detailClone[index] = 'Invalid';
          return { ...acc, error: true, detail: detailClone, message: 'Verification Error' };
        }
        return acc;
      },
      {
        error: false,
        detail: [],
        message: null,
      }
    );
  return res;
};

export default validate;

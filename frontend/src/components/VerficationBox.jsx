import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CodeInput from 'components/CodeInput';
import validate from 'utils/validate';
import api from 'utils/api';
import { CODE_LENGTH } from 'constants/values';

const errorInit = {
  error: false,
  detail: [],
  message: null,
};

const VerficationBox = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(errorInit);

  const handleChange = useCallback((value) => {
    setCode(value);
    setError(errorInit);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const result = validate(code, CODE_LENGTH);
      if (result.error) {
        setError(result);
        return;
      }

      api
        .post('/validate', { code })
        .then(() => {
          onSuccess();
        })
        .catch((err) => {
          if (err.statusCode === 400) {
            if (err.response && err.response.data) console.log(err.response.data);
            setError({
              error: true,
              message: 'Verification Error',
              detail: Array(CODE_LENGTH).fill('Invalid'),
            });
          } else {
            console.error(err);
          }
        });
    },
    [code, onSuccess]
  );

  return (
    <Card style={{ width: '32rem', margin: '120px auto' }}>
      <Card.Body>
        <h3 className="text-center">Verification Code</h3>
        <Form onSubmit={handleSubmit}>
          <CodeInput value={code} onChange={handleChange} error={error} length={CODE_LENGTH} />
          <Button block variant="outline-primary" type="submit" className="text-uppercase">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

VerficationBox.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default VerficationBox;

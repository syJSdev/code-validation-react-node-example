import React, { useState } from 'react';
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CodeInput } from 'components';

function App() {
  const [code, setCode] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="App">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>
            <h3>Verification Code</h3>
          </Form.Label>
          <Form.Control as="div">
            <CodeInput value={code} onChange={setCode} length={6} />
          </Form.Control>
          {/* <Form.Text className="text-muted"></Form.Text> */}
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default App;

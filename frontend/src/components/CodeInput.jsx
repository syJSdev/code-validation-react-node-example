import React, { useState } from 'react';
import DigitInput from './DigitInput';

function App() {
  const [code, setCode] = useState('');

  return (
    <div className="App">
      <DigitInput value={code} onChange={setCode} length={6} />
    </div>
  );
}

export default App;

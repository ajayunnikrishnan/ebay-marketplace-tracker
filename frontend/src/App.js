import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then(res => res.text())
      .then(setMsg);
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <h1>eBay Tracker Frontend</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;

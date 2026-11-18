import { useEffect, useState } from 'react';
import { api } from '../api/client';

// Shows whether the Express API is reachable
const ServerStatus = () => {
  const [status, setStatus] = useState('checking'); // checking | online | offline

  useEffect(() => {
    let active = true; // skip updates after unmount

    api
      .get('/api/health')
      .then(() => active && setStatus('online'))
      .catch(() => active && setStatus('offline'));

    return () => {
      active = false;
    };
  }, []);

  const labels = {
    checking: 'Checking server...',
    online: 'Server online',
    offline: 'Server offline',
  };
  const colors = { checking: 'gray', online: 'green', offline: 'red' };

  return (
    <span style={{ marginLeft: 'auto', color: colors[status] }}>
      ● {labels[status]}
    </span>
  );
};

export default ServerStatus;

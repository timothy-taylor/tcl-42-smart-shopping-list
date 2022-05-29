import { useState, useEffect } from 'react';

export default function useLocalStorage() {
  const [token, setToken] = useState(localStorage.getItem('user-token'));

  useEffect(() => {
    // only save a token if is not null
    token && localStorage.setItem('user-token', token);
  }, [token]);

  return { token, setToken };
}

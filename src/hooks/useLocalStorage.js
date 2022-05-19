import { useState, useEffect } from 'react';

export default function useLocalStorage() {
  const [token, setToken] = useState(localStorage.getItem('user-token'));

  useEffect(() => {
    localStorage.setItem('user-token', token);
  }, [token]);

  return { token, setToken };
}

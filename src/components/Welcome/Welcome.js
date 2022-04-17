import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';
import { parseToken } from '../../lib/util';


const Welcome = () => {
  const [token, setToken] = React.useState(
    window.localStorage.getItem('user-token'),
  );

  const handleClick = (e) => {
    e.preventDefault();
    const parsedToken = parseToken(getToken(words));
    setToken(parsedToken);
  };

  React.useEffect(() => {
    window.localStorage.setItem('user-token', token);
  }, [token]);

  return (
    <>
      {token ? (
        <Navigate to={`/list/${token}`} replace={true} />
      ) : (
        <>
          <h1>Welcome to your smart shopping list</h1>
          <button onClick={(e) => handleClick(e)}>Create new list</button>
        </>
      )}
    </>
  );
};

export default Welcome;

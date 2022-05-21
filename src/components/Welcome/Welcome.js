import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { parseToken } from '../../lib/util';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function Welcome() {
  const { token, setToken } = useLocalStorage();
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(null);

  const handleClick = () => {
    const parsedToken = parseToken(getToken(words));
    setToken(parsedToken);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedUserInput = parseToken(userInput);
    const q = query(collection(db, parsedUserInput), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setError('This token is not valid');
      setUserInput('');
    } else {
      setToken(parsedUserInput);
    }
  };

  return (
    <>
      {token ? (
        <Navigate to={`/list/${token}`} replace={true} />
      ) : (
        <div>
          <h1 className="text-2xl text-center text-primary">
            Welcome to your smart shopping list
          </h1>
          <div className="flex items-center justify-center">
            <button className="bg-secondary rounded-md p-2 text-white" onClick={handleClick}>
              Create new list
            </button>
          </div>
          <div className="text-center p-2">- or -</div>
          <p className="text-center p-2">Join an existing shopping list by entering a three word token.</p>
          <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
            <label className="text-center text-xl" htmlFor="tokenInput">Shared token</label>
            <input
              id="tokenInput"
              type="text"
              placeholder="three word token"
              aria-label="three word token"
              aria-errormessage="inputError"
              aria-invalid={error ? true : false}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              required
            />
            <button className="p-2 bg-secondary text-white" type="submit">Join an existing list</button>
            {error && (
              <div id="inputError" className="text-red">
                {error}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}

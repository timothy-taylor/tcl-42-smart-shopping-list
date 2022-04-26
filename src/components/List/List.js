import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';
import { useParams, Link } from 'react-router-dom';

const List = () => {
  const { token } = useParams();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, token || 'example'), (snapshot) => {
      setDocs(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }),
      );
    });
    return unsub;
  }, []);

  return (
    <>
      <h1>Smart Shopping List</h1>
      <Navigation token={token} />
      {docs.length === 0 ? (
        <div>
          <p>Your shopping list is currently empty</p>
          <Link to={`/addItem/${token}`}>
            <button>Add Item</button>
          </Link>
        </div>
      ) : (
        <>
          <ul>
            {docs.map((doc) => {
              return <li key={doc.id}>{doc.item}</li>;
            })}
          </ul>{' '}
        </>
      )}
    </>
  );
};

export default List;

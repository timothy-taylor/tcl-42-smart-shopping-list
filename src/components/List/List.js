import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
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

  async function onChange() {
    await updateDoc(doc(db, token), {
      purchaseDate: serverTimestamp(),
    });
  }

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
              return (
                <li key={doc.id}>
                  {' '}
                  <input
                    key={`checkbox-${doc.id}`}
                    type="checkbox"
                    id={`checkbox-${doc.id}`}
                    value={doc.purchaseDate ? true : false}
                  ></input>
                  {doc.item}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default List;

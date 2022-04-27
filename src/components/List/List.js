import React, { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Navigation from '../Navigation/Navigation';
import { useParams, Link } from 'react-router-dom';

export const timeDifference = (timestampInMilli) => {
  if (!timestampInMilli) return false;

  const dayInMilli = 86400000;
  const date = Date.now();
  const difference = date - timestampInMilli;
  const comparison = difference < dayInMilli;

  console.log(`differience in ms = ${difference} = ${date} - ${timestampInMilli}`);
  console.log(`less than 24 hours = ${comparison} = ${difference} < ${dayInMilli}`);

  // this will return true when its been less than 24 hours
  // false otherwise
  return comparison;
};

const List = () => {
  const { token } = useParams();
  const [docs, setDocs] = useState([]);

  async function checkboxChange(checked, id) {
    // three different possible states
    // 1: purchaseDate is null, checkbox is unchecked => checking runs servertimestamp
    // 2: purchaseDate exists, checkbox is checked => unchecking sets purchaseDate to null
    // 3: purchaseDate exists, checkbox is unchecked => checking runs serverTimestamp

    await updateDoc(doc(db, token, id), {
      purchaseDate: checked ? null : serverTimestamp(),
    });
  }

  useEffect(() => {
    let unsubscribe;

    if (token)
      unsubscribe = onSnapshot(collection(db, token), (snapshot) => {
        setDocs(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              checked: timeDifference(data.purchaseDate?.toMillis()),
              ...data,
            };
          }),
        );
      });

    return unsubscribe;
  }, [token]);

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
          <ul style={{ listStyle: 'none' }}>
            {docs.map((doc) => {
              return (
                <li key={doc.id}>
                  <input
                    key={`checkbox-${doc.id}`}
                    type="checkbox"
                    id={doc.id}
                    checked={doc.checked}
                    onChange={(e) => checkboxChange(doc.checked, e.target.id)}
                  />
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

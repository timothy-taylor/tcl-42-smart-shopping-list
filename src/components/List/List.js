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

  // this will return true when its been less than 24 hours
  // false otherwise
  return comparison;
};


const List = () => {
  const { token } = useParams();
  const [docs, setDocs] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  async function checkboxChange(checked, id) {
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
          <label>
            Filter items
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </label>
          <button onClick={() => setUserSearch('')}>X</button>
          <ul style={{ listStyle: 'none' }}>
            {docs
              .filter((doc) => {
                // 1) if search input is blank / empty
                // item will pass through filter
                //
                // 2) if search string is part of item name
                // item will pass through filter
                //
                // 3) otherwise item will be filtered out
                if (userSearch === '') {
                  return true;
                } else if (
                  doc.item.toLowerCase().includes(userSearch.toLowerCase())
                ) {
                  return true;
                } else {
                  return false;
                }
              })
              .map((doc) => {
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

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
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { getByDisplayValue } from '@testing-library/react';

export const timeDifference = (timestampInMilli) => {
  if (!timestampInMilli) return false;

  const dayInMilli = 86400000;
  const date = Date.now();
  const difference = date - timestampInMilli;
  const comparison = difference < dayInMilli;

  // console.log(`difference in ms = ${difference} = ${date} - ${timestampInMilli}`);
  // console.log(`less than 24 hours = ${comparison} = ${difference} < ${dayInMilli}`);

  // this will return true when its been less than 24 hours
  // false otherwise
  return comparison;
};

const List = () => {
  const { token } = useParams();
  const [docs, setDocs] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  async function checkboxChange(checked, id) {
    // three different possible states
    // 1) purchaseDate is null, checkbox is unchecked => checking runs servertimestamp
    // 2) purchaseDate exists, checkbox is checked => unchecking sets purchaseDate to null
    // 3) purchaseDate exists, checkbox is unchecked => checking runs serverTimestamp
    
    await updateDoc(doc(db, token, id), {
      purchaseDate: checked ? null : serverTimestamp(),
      //  estimatedNextPurchaseDate: checked ? null : date.getDay(doc.purchaseDate) + Number(doc.purchaseFreq),
    });
  }

  // our date ex: May, 4, 2022 at 7:51:23 AM UTC-5 needs to be converted to a number for the calculation above (.getDay())

  //const calculateEstimate = (docs) => {
  //doc.purchase + doc.purchaseDate = estimatedNextPurchase
  //14 days + May 3, 2022 = May 17, 2022
  //7 days + May 31, 2022 = June 7, 2022
  //create another field for database called estimatedNextPurchase and call calculateEstimate with useEffect()
  //if (docs.purchaseDate) {
  //const nextPurchaseDate = Number(docs.purchase) + Number(docs.purchaseDate)
  //} else if (docs.purchaseDate === null){
  //return true;
  //keep estimatedNextPurchase the same;  maybe return true or something
  //} else {
  //return null;
  //}
  //}

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

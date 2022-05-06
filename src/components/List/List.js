import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Navigation from '../Navigation/Navigation';
import { useParams, Link } from 'react-router-dom';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

export const DAY_IN_MILLISEC = 86400000;

export const isLessThan24HoursOld = (timestampInMilli) => {
  if (!timestampInMilli) return false;

  const date = Date.now();
  const difference = date - timestampInMilli;
  const comparison = difference < DAY_IN_MILLISEC;

  // this will return true when its been less than 24 hours
  // false otherwise
  return comparison;
};

export const daysSincePurchase = (timestampInMilli, dateCreatedInMilli) => {
  const workingTimestamp = timestampInMilli || dateCreatedInMilli;

  const date = Date.now();
  const differenceInMilli = date - workingTimestamp;
  const differenceInDays = differenceInMilli / DAY_IN_MILLISEC;

  return differenceInDays;
};

export default function List() {
  const { token } = useParams();
  const [docs, setDocs] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  async function checkboxChange(item) {
    if (item.checked) {
      //
      // undo a purchase
      await updateDoc(doc(db, token, item.id), {
        purchaseDate: null,
        estimatedNextPurchaseDate: null,
      });
    } else {
      //
      // update the purchaseDate, nextPurchaseDate, and purchaseFreq
      const newTotalPurchases = item.totalPurchases + 1;
      const estimateInDays = calculateEstimate(
        item.purchaseFreq,
        daysSincePurchase(
          item.purchaseDate?.toMillis(),
          item.createdAt.toMillis(),
        ),
        newTotalPurchases,
      );

      const now = new Date();
      const nextPurchaseDate = new Date(
        now.getTime() + estimateInDays * DAY_IN_MILLISEC,
      );

      await updateDoc(doc(db, token, item.id), {
        purchaseDate: now,
        totalPurchases: newTotalPurchases,
        purchaseFreq: estimateInDays,
        estimatedNextPurchaseDate: nextPurchaseDate,
      });
    }
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
              checked: isLessThan24HoursOld(data.purchaseDate?.toMillis()),
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
          <button
            aria-label="Clear filter input"
            onClick={() => setUserSearch('')}
          >
            X
          </button>
          <ul style={{ listStyle: 'none' }}>
            {docs
              .filter(({ item }) => {
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
                  item.toLowerCase().includes(userSearch.toLowerCase())
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
                      onChange={() => checkboxChange(doc)}
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
}

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

export const timeDifference = (timestampInMilli) => {
  if (!timestampInMilli) return false;

  const dayInMilli = 86400000;
  const date = Date.now();
  const difference = date - timestampInMilli;
  const comparison = difference < dayInMilli;

  console.log(`${difference} = ${date} - ${timestampInMilli}`);
  console.log(`${comparison} = ${difference} < ${dayInMilli}`);

  // this will return true when its less than 24 hours
  // false otherwise
  return comparison;
};

const List = () => {
  const { token } = useParams();
  const [docs, setDocs] = useState([]);
  const [checkedState, setCheckedState] = useState([]);

  async function checkboxChange(checked, id) {
    console.log('checkbox clicked, checked: ', checked);

    // three different possible states
    // 1: purchaseDate is null, checkbox is unchecked => checking it runs servertimestamp
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
        const docsFromSnapshot = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setDocs(docsFromSnapshot);
        setCheckedState(
          docsFromSnapshot.map((doc) =>
            timeDifference(doc.purchaseDate?.toMillis()),
          ),
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
            {docs.map((doc, i) => {
              return (
                <li key={doc.id}>
                  <input
                    key={`checkbox-${doc.id}`}
                    type="checkbox"
                    id={`${doc.id}`}
                    checked={checkedState[i]}
                    onChange={(e) =>
                      checkboxChange(checkedState[i], e.target.id)
                    }
                  />
                  {`${doc.item}: ${doc.purchaseDate} @ ${doc.purchase} / ${checkedState[i]}`}
                </li>
              );
            })}
          </ul>
          {JSON.stringify(checkedState)}
        </>
      )}
    </>
  );
};

export default List;

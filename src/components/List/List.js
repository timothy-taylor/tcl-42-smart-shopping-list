import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import useSnapshot from '../../hooks/useSnapshot';
import Navigation from '../Navigation/Navigation';
import { DAY_IN_MILLISEC } from '../../lib/util';

export const daysSincePurchase = (datePurchaseInMilli, dateCreatedInMilli) => {
  const workingTimestamp = datePurchaseInMilli || dateCreatedInMilli;

  const differenceInMilli = Date.now() - workingTimestamp;
  return differenceInMilli / DAY_IN_MILLISEC;
};

function getPurchaseDates(estimateInDays) {
  const purchaseDate = new Date();
  const estimatedNextPurchaseDate = new Date(
    purchaseDate.getTime() + estimateInDays * DAY_IN_MILLISEC,
  );

  return [purchaseDate, estimatedNextPurchaseDate];
}

function getPurchaseData(item) {
  const totalPurchases = item.totalPurchases + 1;
  const purchaseFreq = calculateEstimate(
    item.purchaseFreq,
    daysSincePurchase(item.purchaseDate?.toMillis(), item.createdAt.toMillis()),
    totalPurchases,
  );

  return [totalPurchases, purchaseFreq];
}

export default function List() {
  const { token } = useParams();
  const { docs } = useSnapshot(token);
  const [userSearch, setUserSearch] = useState('');

  async function undoPurchase(id) {
    await updateDoc(doc(db, token, id), {
      purchaseDate: null,
      estimatedNextPurchaseDate: null,
    });
  }

  async function updatePurchase(item) {
    const [totalPurchases, purchaseFreq] = getPurchaseData(item);
    const [purchaseDate, estimatedNextPurchaseDate] =
      getPurchaseDates(purchaseFreq);

    await updateDoc(doc(db, token, item.id), {
      purchaseDate,
      totalPurchases,
      purchaseFreq,
      estimatedNextPurchaseDate,
    });
  }

  async function checkboxChange(item) {
    if (item.checked) {
      undoPurchase(item.id);
    } else {
      updatePurchase(item);
    }
  }
  function isInactive(purchaseDate, estimatedNextPurchaseDate) {
    //the current date from when it was purchased. Checked if thats 2X's more of the estimatedNPD
    const date = new Date(purchaseDate);
    const timeElapsed = date.getTime() - Date.now();
    const estiDate = new Date(estimatedNextPurchaseDate);
    const comparison = timeElapsed * 2 > estiDate.getTime();

    return comparison;
  }

  function styleCheckbox(
    purchaseFreq,
    totalPurchases,
    purchaseDate,
    estimatedNextPurchaseDate,
  ) {
    if (
      totalPurchases < 2 ||
      isInactive(purchaseDate, estimatedNextPurchaseDate)
    ) {
      return 'black';
    }
    if (purchaseFreq <= 7) {
      return 'green';
    }
    if (purchaseFreq <= 14) {
      return 'orange';
    }
    return 'red';
  }

  function accessibilityLabel(
    purchaseFreq,
    totalPurchases,
    purchaseDate,
    estimatedNextPurchaseDate,
  ) {
    if (
      totalPurchases < 2 ||
      isInactive(purchaseDate, estimatedNextPurchaseDate)
    ) {
      return 'not purchase';
    }
    if (purchaseFreq <= 7) {
      return 'purchase in less than 7 days';
    }
    if (purchaseFreq <= 14) {
      return 'purchase in less than 14 days';
    }
    return 'purchase in 30 days';
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
              .sort((a, b) => {
                if (a.purchaseFreq < b.purchaseFreq) {
                  return -1;
                }
                if (a.purchaseFreq > b.purchaseFreq) {
                  return 1;
                }
                return 0;
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
                    <span
                      aria-label={accessibilityLabel(
                        doc.purchaseFreq,
                        doc.totalPurchases,
                        doc.purchaseDate,
                        doc.estimatedNextPurchaseDate
                      )}
                      style={{
                        color: styleCheckbox(
                          doc.purchaseFreq,
                          doc.totalPurchases,
                          doc.purchaseDate,
                          doc.estimatedNextPurchaseDate
                        ),
                      }}
                    >
                      {doc.item}
                    </span>
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </>
  );
}

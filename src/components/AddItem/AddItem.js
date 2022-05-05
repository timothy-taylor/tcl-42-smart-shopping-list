import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Navigation from '../Navigation/Navigation';

export const normalizeInput = (listItem) =>
  listItem
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ');

export default function AddItem() {
  const { token } = useParams();
  const [itemName, setItemName] = useState('');
  const [purchaseFreq, setPurchaseFreq] = useState('7');
  const [error, setError] = useState(null);

  async function checkForDuplicates() {
    const items = [];
    const querySnapshot = await getDocs(collection(db, token));

    querySnapshot.forEach((doc) => {
      items.push(doc.data().item);
    });

    return items.some(
      (item) => normalizeInput(item) === normalizeInput(itemName),
    );
  }

  async function handleClick(e) {
    e.preventDefault();

    if (await checkForDuplicates()) {
      setError('This item is already on your list!');
      setItemName('');
    } else {
      try {
        await addDoc(collection(db, token), {
          item: itemName,
          purchaseFreq: parseInt(purchaseFreq),
          createdAt: serverTimestamp(),
          purchaseDate: null,
          estimatedNextPurchaseDate: null,
          totalPurchases: 0,
        });
        setItemName('');
        setPurchaseFreq('7');
        setError(null);
      } catch (e) {
        setError(`Error adding document: ${e}`);
      }
    }
  }

  return (
    <>
      <Navigation token={token} />
      <h1>Smart Shopping List</h1>
      <div>
        <form onSubmit={(e) => handleClick(e)}>
          <input
            type="text"
            required
            value={itemName}
            placeholder="item"
            aria-label="item"
            onChange={(e) => setItemName(e.target.value)}
          ></input>
          <fieldset>
            <legend>Frequency</legend>
            <div className="radio">
              <label>
                <input
                  name="frequency"
                  type="radio"
                  value="7"
                  checked={purchaseFreq === '7'}
                  onChange={(e) => {
                    setPurchaseFreq(e.target.value);
                  }}
                />
                Soon
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  name="frequency"
                  type="radio"
                  value="14"
                  checked={purchaseFreq === '14'}
                  onChange={(e) => {
                    setPurchaseFreq(e.target.value);
                  }}
                />
                Kinda soon
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  name="frequency"
                  type="radio"
                  value="30"
                  checked={purchaseFreq === '30'}
                  onChange={(e) => {
                    setPurchaseFreq(e.target.value);
                  }}
                />
                Not soon
              </label>
            </div>
          </fieldset>
          <button type="submit">Add Data</button>
        </form>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </>
  );
}

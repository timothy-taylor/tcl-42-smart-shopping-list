import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';
import { useParams } from 'react-router-dom';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [purchaseFreq, setPurchaseFreq] = useState('7');
  const [lastPurchaseDate, setLastPurchaseDate] = useState(null);
  const [error, setError] = useState(null);
  const [estimatedNextPurchase, setEstimatedNextPurchase] = useState(null);

  const { token } = useParams();

  const normalizeInput = listItem => {
    const normalizedInput = listItem.toUpperCase().replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ");
    return normalizedInput;
  };

  const checkForDuplicates = async () => {
    const items = [];
    const querySnapshot = await getDocs(collection(db, token));
    querySnapshot.forEach((doc) => {
      items.push(doc.data().item);
    });
    return items.some(item => normalizeInput(item) === normalizeInput(itemName));
  };

  async function handleClick(e) {
    e.preventDefault();
    try {
     const check = await checkForDuplicates();
     console.log('dup?', check);
     if (check) {
      setError('This item is already on your list!');
      setItemName('');
     } else {
      const colRef = collection(db, token);
      const docRef = await addDoc(colRef, {
        item: itemName,
        purchaseFreq: purchaseFreq,
        createdAt: serverTimestamp(),
        purchaseDate: lastPurchaseDate,
        estimatedNextPurchaseDate: estimatedNextPurchase, //prints Nan to the firestore database
      });
      console.log('Document written with ID: ', docRef.id);
      console.log('Saved state of frequency', purchaseFreq);
      setItemName('');
      setPurchaseFreq('7');
     }
    } catch (e) {
      console.error('Error adding document: ', e);
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
        <div style={{color: 'red'}}>{error}</div>
      </div>
    </>
  );
};

export default AddItem;

//import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';


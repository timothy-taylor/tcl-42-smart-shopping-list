import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { normalize } from '../../lib/util';
import Layout from '../Layout/Layout';

function Checkbox({ text, value, purchaseFreq, setPurchaseFreq }) {
  return (
    <label className="font-serif lowercase">
      <input
        className="my-1 mx-2 text-secondary"
        name="frequency"
        type="radio"
        value={value}
        checked={purchaseFreq === value}
        onChange={(e) => {
          setPurchaseFreq(e.target.value);
        }}
      />
      {text}
    </label>
  );
}

export default function AddItem() {
  const { token } = useParams();
  const [itemName, setItemName] = useState('');
  const [purchaseFreq, setPurchaseFreq] = useState('7');
  const [error, setError] = useState(null);

  async function hasDuplicates() {
    const items = [];
    const querySnapshot = await getDocs(collection(db, token));

    querySnapshot.forEach((doc) => {
      items.push(doc.data().item);
    });

    return items.some((item) => normalize(item) === normalize(itemName));
  }

  async function handleClick(e) {
    e.preventDefault();

    if (await hasDuplicates()) {
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
    <Layout token={token}>
      <div className="flex justify-center items-center">
        <form className="" onSubmit={(e) => handleClick(e)}>
          <input
            className="rounded-md focus:border-primary"
            type="text"
            required
            value={itemName}
            placeholder="item"
            aria-label="item"
            onChange={(e) => setItemName(e.target.value)}
          />
          <fieldset className="flex flex-col">
            <legend className="text-primary">Frequency</legend>
            <Checkbox
              text="Soon"
              value="7"
              {...{ purchaseFreq, setPurchaseFreq }}
            />
            <Checkbox
              text="Kinda soon"
              value="14"
              {...{ purchaseFreq, setPurchaseFreq }}
            />
            <Checkbox
              text="Not soon"
              value="30"
              {...{ purchaseFreq, setPurchaseFreq }}
            />
          </fieldset>
          <button className="p-2 rounded-md bg-neutral text-white" type="submit">
            Add Item
          </button>
        </form>
        {error && <div className="text-red">{error}</div>}
      </div>
    </Layout>
  );
}

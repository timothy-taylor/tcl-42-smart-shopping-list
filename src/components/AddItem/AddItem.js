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

const Warning = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const StyledButton = ({ type, text }) => (
  <button
    className="w-full p-2 rounded-md border-2 border-primary dark:border-secondary text-primary font-bold dark:text-secondary hover:bg-primary hover:text-white dark:hover:bg-secondary"
    type={type}
  >
    {text}
  </button>
);

function RadioButtons({ text, value, purchaseFreq, setPurchaseFreq }) {
  return (
    <label className="lowercase dark:text-white">
      <input
        className="m-2 text-secondary hover:cursor-pointer"
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

  const centeredFlexBox = 'flex justify-center items-center';

  return (
    <Layout token={token}>
      <div
        className={
          centeredFlexBox + '  dark:border-t-2 dark:border-t-secondary'
        }
      >
        <div className={centeredFlexBox + ' w-full mt-4 flex-col'}>
          <h2 className="p-4 font-bold text-primary dark:text-secondary">
            Add a new item to your list
          </h2>
          <form className="" onSubmit={(e) => handleClick(e)}>
            <input
              className={`w-full font-serif dark:bg-primary dark:text-white ${error ? 'border-red-600' : 'border-neutral'} rounded-md focus:border-primary`}
              type="text"
              required
              value={itemName}
              placeholder="enter item name"
              aria-label="item name"
              onChange={(e) => setItemName(e.target.value)}
            />
            <fieldset className="flex flex-col my-10">
              <legend className="text-primary text-center font-bold dark:text-secondary">
                Purchase frequency?
              </legend>
              <RadioButtons
                text="Soon"
                value="7"
                {...{ purchaseFreq, setPurchaseFreq }}
              />
              <RadioButtons
                text="Kinda soon"
                value="14"
                {...{ purchaseFreq, setPurchaseFreq }}
              />
              <RadioButtons
                text="Not soon"
                value="30"
                {...{ purchaseFreq, setPurchaseFreq }}
              />
            </fieldset>
            <StyledButton type="submit" text="Add Item" />
          </form>
          {error && <div className="flex justify-center mt-5 text-red-600"><Warning />{error}</div>}
        </div>
      </div>
    </Layout>
  );
}

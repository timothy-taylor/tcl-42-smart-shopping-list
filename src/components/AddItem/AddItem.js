import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { normalize, buttonStyles } from '../../lib/util';
import Layout from '../Layout/Layout';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function RadioButton({ text, value, purchaseFreq, setPurchaseFreq }) {
  return (
    <label>
      <input
        className="m-2 ml-4 text-secondary dark:text-neutral hover:cursor-pointer"
        name="frequency"
        type="radio"
        value={value}
        checked={purchaseFreq === value}
        onChange={(e) => {
          setPurchaseFreq(e.target.value);
        }}
      />
      <span className="pl-1 lowercase dark:text-white">{text}</span>
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
      <div className="flex justify-center items-center dark:border-t-2 dark:border-t-secondary">
        <div className="flex justify-center items-center w-full mt-4 flex-col">
          <h2 className="p-4 font-bold text-primary dark:text-secondary">
            Add a new item to your list
          </h2>
          <form className="w-3/4" onSubmit={(e) => handleClick(e)}>
            <input
              className={`w-full font-serif dark:bg-primary dark:text-white ${
                error ? 'border-red-600' : 'border-neutral'
              } rounded-md focus:border-primary`}
              type="text"
              required
              value={itemName}
              placeholder="enter item name"
              aria-label="item name"
              aria-errormessage="inputError"
              aria-invalid={error ? true : false}
              onChange={(e) => setItemName(e.target.value)}
            />
            <fieldset className="flex flex-col my-10 border border-neutral rounded-md p-4">
              <legend className="text-primary text-center font-bold dark:text-secondary">
                Select purchase frequency
              </legend>
              <RadioButton
                text="Soon"
                value="7"
                {...{ purchaseFreq, setPurchaseFreq }}
              />
              <RadioButton
                text="Kinda soon"
                value="14"
                {...{ purchaseFreq, setPurchaseFreq }}
              />
              <RadioButton
                text="Not soon"
                value="30"
                {...{ purchaseFreq, setPurchaseFreq }}
              />
            </fieldset>
            <button className={buttonStyles} type="submit">
              Add Item
            </button>
          </form>
          {error && <ErrorMessage error={error} id="inputError" />}
        </div>
      </div>
    </Layout>
  );
}

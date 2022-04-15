import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [purchaseFreq, setPurchaseFreq] = useState('7');
  const [lastPurchaseDate, setLastPurchaseDate] = useState(null);
  // const date = new Date();

  async function handleClick(e) {
    await setItemName(e.target.value);
    await setPurchaseFreq(e.target.value);
    await setLastPurchaseDate(e.target.value);

    // const purchaseDate = lastPurchaseDate.setDate(lastPurchaseDate.getDate() + {purchaseFreq});
    // console.log("This is the next purchase date", purchaseDate.toDateString());

    try {
      const colRef = collection(db, 'users');
      const docRef = await addDoc(colRef, {
        item: itemName,
        purchase: { purchaseFreq },
        createdAt: serverTimestamp(),
        purchaseDate: { lastPurchaseDate },
      });
      console.log('Document written with ID: ', docRef.id);
      console.log('Saved state of frequenxy', purchaseFreq);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  // function handleFreqChange(e){
  //   setPurchaseFreq(e.target.value);
  // }

  //for last purchase date
  //hypothetically, we could do a created at stamp. In which, whenever the item was added to the list, that data is then "created" at that day and time.
  //so dynamically, we can add +7, +14, +30 to the day that it was created

  return (
    <>
      <Navigation />
      <h1>Smart Shopping List</h1>
      <div>
        <form>
          <label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            ></input>
            Name
          </label>
        </form>
        <form>
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
                onClick={setPurchaseFreq}
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
                onClick={setPurchaseFreq}
                checked={purchaseFreq === '30'}
                onChange={(e) => {
                  setPurchaseFreq(e.target.value);
                }}
              />
              Not soon
            </label>
          </div>
        </form>
      </div>
      <div className="content">
        <form id="add-shopping-list-form"></form>
        <ul id="shopping-list"></ul>
      </div>
      <button onClick={(e) => handleClick(e)}>Add Data</button>
    </>
  );
};

export default AddItem;

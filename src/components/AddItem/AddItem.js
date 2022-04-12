import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [purchaseFreq, setPurchaseFreq] = useState('');

  async function handleClick(e) {
    setItemName(e.target.value);


    try {
      const colRef = collection(db, 'users');
      const docRef = await addDoc(colRef, {
        item: {itemName},
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  function handleItemChange(event) {
  }



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
              <input type="radio" value="soon" />
              Soon
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" value="kinda" />
              Kinda soon
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" value="not" />
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

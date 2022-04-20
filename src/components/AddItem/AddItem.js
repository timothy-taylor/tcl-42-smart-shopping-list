import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';
import { useParams } from 'react-router-dom';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [purchaseFreq, setPurchaseFreq] = useState('7');
  const [lastPurchaseDate, setLastPurchaseDate] = useState(null);

  const { token } = useParams();

  const getSnapshot = async () => {
    const userList = [];
    const querySnapshot = await getDocs(collection(db, token));
    querySnapshot.forEach((doc) => {
      userList.push(doc.data().item);
    });
    console.log(userList)
    return userList;
  };
  getSnapshot();

  // const checkForDuplicates = (input, userList) => {
  //   const normalizedInput = input.toLowerCase
  //   for (let item of userList) {
  //     if doc === input {
  //       throw new Error('This item is already on the list!')
  //     };
  //     if 
  //   }
  // };

  async function handleClick(e) {
    e.preventDefault();

    try {
      const colRef = collection(db, token);
      const docRef = await addDoc(colRef, {
        item: itemName,
        purchase: purchaseFreq,
        createdAt: serverTimestamp(),
        purchaseDate: lastPurchaseDate,
      });
      console.log('Document written with ID: ', docRef.id);
      console.log('Saved state of frequenxy', purchaseFreq);
      setItemName('')
      setPurchaseFreq('7')
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
          <label>
            <input
              type="text"
              required
              value={itemName}
              placeholder="item"
              aria-label="item"
              onChange={(e) => setItemName(e.target.value)}
            ></input>
          </label>
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
      </div>
    </>
  );
};

export default AddItem;

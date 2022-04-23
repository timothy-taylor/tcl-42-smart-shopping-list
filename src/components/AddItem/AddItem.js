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

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [purchaseFreq, setPurchaseFreq] = useState('7');
  const [lastPurchaseDate, setLastPurchaseDate] = useState(null);
  const [userList, setUserList] = useState([]);

  const { token } = useParams();

  // useEffect(() => {
  //   const getSnapshot = async () => {
  //     const userList = [];
  //     const querySnapshot = await getDocs(collection(db, token));
  //     querySnapshot.forEach((doc) => {
  //       userList.push(doc.data().item);
  //     });
  //     console.log(userList)
  //     return userList;
  //   };
  // }, []);

  // const checkForDuplicates = async (input) => {
  //   const currentList = await getSnapshot();
  //   const normalizedInput = input.replace(/[^\W\s]/g, '');
  //   console.log(normalizedInput);
  //   for (let item of currentList) {
  //     if (item === input) {
  //       throw new Error('This item is already on the list!')
  //     } else if (item === normalizedInput) {
  //       throw new Error('This item is already on the list!')
  //     }
  //   return item;
  //   }
  // };

  const checkForDuplicates = async () => {
    const items = [];
    const querySnapshot = await getDocs(collection(db, token));
    querySnapshot.forEach((doc) => {
      items.push(doc.data().item);
    });
    //this is just setting the itemName to true or false
    const dup = items.some(item => item === itemName)
    //now that this is working, we just need to do some logic that brings up the message which, i took the model Rebecca was trying to give it a shot
    if(dup === true){
      alert('Item added!')
    } else if ( dup === false) {
      throw new Error('Item already exists')
    }
    //if true do this, if false do that
    return dup
  };

  async function handleClick(e) {
    e.preventDefault();
    try {
     const check = await checkForDuplicates();
     console.log('dup', check)
      const colRef = collection(db, token);
      const docRef = await addDoc(colRef, {
        item: itemName,
        purchase: purchaseFreq,
        createdAt: serverTimestamp(),
        purchaseDate: lastPurchaseDate,
      });
      console.log('Document written with ID: ', docRef.id);
      console.log('Saved state of frequency', purchaseFreq);
      setItemName('');
      setPurchaseFreq('7');
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
      </div>
    </>
  );
};

export default AddItem;

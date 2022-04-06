import React from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddData() {

async function handleClick(e) {
     e.preventDefault();
    // console.log(db)

    try {
      const colRef = collection(db, "users");
      const docRef = await addDoc(colRef, {
        item: 'bread',
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  return (
    <div>
      <h1>Smart Shopping List</h1>
      <div className="content">
        <form id="add-shopping-list-form"></form>
        <ul id="shopping-list"></ul>
      </div>
      <button type="button" onClick={(e) => handleClick(e)}>
        Add Data
      </button>
    </div>
  );
}

import React from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';
import { useParams } from 'react-router-dom';

const AddItem = () => {
  const { token } = useParams();

  async function handleClick(e) {
    e.preventDefault();

    try {
      const colRef = collection(db, 'users');
      const docRef = await addDoc(colRef, {
        item: 'bread',
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  return (
    <>
      <Navigation token={token} />
      <h1>Smart Shopping List</h1>
      <div className="content">
        <form id="add-shopping-list-form"></form>
        <ul id="shopping-list"></ul>
      </div>
      <button onClick={(e) => handleClick(e)}>Add Data</button>
    </>
  );
};

export default AddItem;

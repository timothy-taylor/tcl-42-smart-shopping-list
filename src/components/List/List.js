import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';

const List = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc));
      setDocs(snapshotDocs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navigation />
      <ul>
        {docs.map((doc) => {
          return <li key={doc.id}>{doc.id}</li>;
        })}
      </ul>
    </>
  );
};

export default List;

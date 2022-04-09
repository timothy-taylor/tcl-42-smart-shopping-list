import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const ShowData = () => {
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
    <div>
      <ul>
      {docs.map((doc) => {
        return (
            <li key={doc.id}>{doc.id}</li>
        );
      })}
      </ul>
    </div>
  );
};

export default ShowData;

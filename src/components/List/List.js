import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot} from 'firebase/firestore';
import Navigation from '../Navigation/Navigation';
import { useParams } from 'react-router-dom';

const List = () => {
  const { token } = useParams();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, token), (snapshot) => {
      setDocs(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }),
      );
    });
    return unsub;
  }, []);

  return (
    <>
      <Navigation token={token} />
      <ul>
        {docs.map((doc) => {
          return <li key={doc.id}>{doc.item}</li>;
        })}
      </ul>
    </>
  );
};

export default List;

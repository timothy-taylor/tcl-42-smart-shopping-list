import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DAY_IN_MILLISEC } from '../lib/util';

export const isLessThan24HoursOld = (datePurchaseInMilli) => {
  if (!datePurchaseInMilli) return false;

  const difference = Date.now() - datePurchaseInMilli;
  return difference < DAY_IN_MILLISEC;
};

export default function useSnapshot(token) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    let unsubscribe;

    if (token)
      unsubscribe = onSnapshot(collection(db, token), (snapshot) => {
        setDocs(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              checked: isLessThan24HoursOld(data.purchaseDate?.toMillis()),
              ...data,
            };
          }),
        );
      });

    return unsubscribe;
  }, [token]);

  return { docs };
}
